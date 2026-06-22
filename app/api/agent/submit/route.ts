import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function callMCP(server: string, method: string, params: any, invoiceId: string | null = null) {
  if (invoiceId) {
    await logMCPTool(invoiceId, server, method, "Invoked", params, null);
  }

  let result = null;
  let error = null;

  try {
    if (method === "validate_ubl_invoice") {
      const { invoice } = params;
      const total = parseFloat(invoice.total_payable);
      let isValid = true;
      let errors = [];
      if (invoice.buyer_tin === "EI00000000010" && total >= 10000) {
        isValid = false;
        errors.push({ code: "PHASE4_LIMIT_EXCEEDED", message: "Consolidated invoices cannot exceed RM10,000." });
      }
      await new Promise(r => setTimeout(r, 800));
      result = { status: isValid ? "Validated" : "Validation Failed", errors: errors.length > 0 ? errors : null };
    }
    else if (method === "generate_lhdn_qr") {
      const { uuid, origin } = params;
      await new Promise(r => setTimeout(r, 500));
      result = { qr_url: `${origin || 'http://localhost:3000'}/verify/${uuid}` };
    }

    if (invoiceId) {
      await logMCPTool(invoiceId, server, method, error ? "Error" : "Success", params, error || result);
    }
    return { result, error };
  } catch (e: any) {
    if (invoiceId) {
      await logMCPTool(invoiceId, server, method, "Error", params, { message: e.message });
    }
    return { error: { message: e.message } };
  }
}

async function logMCPTool(invoiceId: string, mcpServer: string, toolName: string, status: string, input: any, output: any) {
  const client = await pool.connect();
  try {
    await client.query(`
      INSERT INTO mcp_tool_logs (invoice_id, mcp_server, tool_name, status, input_payload, output_response)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [invoiceId, mcpServer, toolName, status, JSON.stringify(input), JSON.stringify(output)]);
  } catch (e) {
    console.error("Failed to log MCP tool:", e);
  } finally {
    client.release();
  }
}

export async function POST(req: NextRequest) {
  try {
    const { invoice, items, documentType } = await req.json();

    const client = await pool.connect();
    let invoiceId = "";
    try {
      const inv = invoice || {};
      const invItems = items || [];

      let insertSuccess = false;
      let currentInvoiceNumber = inv.invoice_number || `INV-${Date.now()}`;
      let attempts = 0;

      while (!insertSuccess && attempts < 5) {
        try {
          const res = await client.query(`
            INSERT INTO invoices (
              invoice_number, invoice_type_code, raw_input_type,
              supplier_name, supplier_tin, supplier_brn, supplier_msic_code, supplier_msic_desc,
              supplier_state_code, supplier_address, supplier_contact, supplier_email,
              buyer_name, buyer_tin, buyer_brn, buyer_state_code, buyer_address,
              buyer_contact, buyer_email,
              currency_code, exchange_rate, subtotal, tax_total, total_payable,
              lhdn_status, requires_immediate_submission
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26
            ) RETURNING id
          `, [
            currentInvoiceNumber,
            inv.invoice_type_code || '01',
            documentType === 'image' ? 'pdf_upload' : 'whatsapp',
            inv.supplier_name || 'Extracted Vendor',
            inv.supplier_tin || 'C1234567890',
            inv.supplier_brn || '00000',
            inv.supplier_msic_code || '00000',
            inv.supplier_msic_desc || 'General',
            inv.supplier_state_code || '14',
            inv.supplier_address || 'KL',
            inv.supplier_contact || '000',
            inv.supplier_email || 'vendor@example.com',
            inv.buyer_name || 'General Public',
            inv.buyer_tin || 'EI00000000010',
            inv.buyer_brn || '000000000000',
            inv.buyer_state_code || ((inv.buyer_tin && inv.buyer_tin !== 'EI00000000010') ? '14' : '17'),
            inv.buyer_address || '-',
            inv.buyer_contact || '-',
            inv.buyer_email || '-',
            inv.currency_code || 'MYR',
            parseFloat(inv.exchange_rate || 1.0),
            parseFloat(inv.subtotal || 0),
            parseFloat(inv.tax_total || 0),
            parseFloat(inv.total_payable || 0),
            'Pending Extraction',
            parseFloat(inv.total_payable || 0) >= 10000
          ]);
          invoiceId = res.rows[0].id;
          insertSuccess = true;
        } catch (dbErr: any) {
          if (dbErr.code === '23505') {
            attempts++;
            const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
            currentInvoiceNumber = `${inv.invoice_number || 'INV'}-${randomSuffix}`;
          } else {
            throw dbErr;
          }
        }
      }

      if (!insertSuccess) {
        throw new Error("Failed to insert invoice record due to persistent unique constraint violations.");
      }

      const VALID_TAX_TYPES = ['01', '02', '03', 'E', 'N/A'];
      for (const item of invItems) {
        const rawTaxType = item.tax_type ?? item.taxType ?? null;
        const taxType = VALID_TAX_TYPES.includes(rawTaxType) ? rawTaxType : 'N/A';
        const unitMeasurement = item.unit_measurement || item.unitMeasurement || 'EA';
        const classificationCode = item.classification_code || item.classificationCode || '022';
        await client.query(`
          INSERT INTO invoice_items (
            invoice_id, description, quantity, unit_measurement,
            unit_price, subtotal, tax_type, tax_rate, tax_amount, classification_code
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          invoiceId,
          item.description || 'Item',
          sanitizeNum(item.quantity) || 1,
          unitMeasurement,
          sanitizeNum(item.unit_price),
          sanitizeNum(item.subtotal),
          taxType,
          sanitizeNum(item.tax_rate),
          sanitizeNum(item.tax_amount),
          classificationCode
        ]);
      }
    } finally {
      client.release();
    }

    // Log the write operation
    await logMCPTool(invoiceId, 'supabase-db-mcp', 'write_invoice_record', 'Success', invoice, { invoice_id: invoiceId });

    // 2. Validate Phase 4 Limits
    const fullInvRes = await pool.query('SELECT * FROM invoices WHERE id = $1', [invoiceId]);
    const fullInv = fullInvRes.rows[0];

    const validationUrl = new URL('/api/lhdn-sandbox/v1.1/documents/submissions', req.nextUrl.origin).toString();
    const valResRaw = await fetch(validationUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invoiceId,
        invoice: fullInv,
        items: items || []
      })
    });
    const valRes = await valResRaw.json();

    let lhdnStatus = valRes.status || 'Validation Failed';
    let valErrors = valRes.errors || null;

    // 3. Generate QR
    const qrRes = await callMCP('lhdn-validator-mcp', 'generate_lhdn_qr', { uuid: invoiceId, origin: req.nextUrl.origin }, invoiceId);
    let qrUrl = qrRes.result?.qr_url || null;

    // 4. Update Database
    const updateClient = await pool.connect();
    try {
      await updateClient.query(`
        UPDATE invoices 
        SET lhdn_status = $1, validation_errors = $2, lhdn_qr_url = $3, lhdn_uuid = $4, lhdn_validation_date = now()
        WHERE id = $5
      `, [lhdnStatus, valErrors ? JSON.stringify(valErrors) : null, qrUrl, invoiceId, invoiceId]);
    } finally {
      updateClient.release();
    }

    return NextResponse.json({ success: true, invoice_id: invoiceId, status: lhdnStatus });
  } catch (error: any) {
    console.error("Agent Submit Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function sanitizeNum(val: any): number {
  if (val === undefined || val === null) return 0;
  const num = typeof val === 'number' ? val : parseFloat(String(val));
  return Number.isFinite(num) ? num : 0;
}
