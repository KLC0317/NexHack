import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";
import { Pool } from "pg";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Helper to interact with our local MCP router internally
async function callMCP(server: string, method: string, params: any, invoiceId: string | null = null) {
  // First, log the invocation
  if (invoiceId) {
    await logMCPTool(invoiceId, server, method, "Invoked", params, null);
  }

  // Simulate internal call to our MCP Router
  // In a real environment, this could be a fetch to an external/internal URL
  // We'll mimic the internal logic for speed, or we can fetch against our own endpoint
  // For safety in this environment without a stable hostname, we'll do direct DB calls for writes
  // but let's implement the logic here to keep it simple.

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
    const { documentType, documentData, documentMime } = await req.json();
    // documentType: 'text' or 'image'
    // documentData: base64 string or raw text
    // documentMime: optional mime type override (defaults to application/pdf for image type)

    let prompt = `You are a Malaysian Tax Auditor. Analyze the items in the receipt/order.
Map each item to its corresponding 5-digit Malaysia Standard Industrial Classification (MSIC) code (e.g., 23990 for mineral products, 56101 for restaurants, 47111 for provision stores).
Classify the tax category to standard LHDN codes: '01' (SST 6%/10%), '02' (Service Tax 6%/8%), or 'E' (Exempt).
Detect if the transaction is a single invoice total >= RM10,000.00.`;

    let parts: any[] = [];
    if (documentType === 'image') {
      const mimeType = documentMime || "application/pdf";
      parts = [
        { text: prompt },
        { inlineData: { data: documentData, mimeType } }
      ];
    } else {
      parts = [
        { text: prompt },
        { text: "Raw Document Text: " + documentData }
      ];
    }


    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: parts,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            invoice_number: { type: Type.STRING },
            invoice_type_code: { type: Type.STRING, description: "01=Invoice, 02=Credit Note, 03=Debit Note, 04=Refund" },
            supplier_name: { type: Type.STRING },
            supplier_tin: { type: Type.STRING },
            supplier_brn: { type: Type.STRING },
            buyer_name: { type: Type.STRING },
            buyer_tin: { type: Type.STRING },
            buyer_brn: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  unit_price: { type: Type.NUMBER },
                  subtotal: { type: Type.NUMBER },
                  tax_type: { type: Type.STRING, description: "'01' | '02' | '03' | 'E' | 'N/A'" },
                  tax_rate: { type: Type.NUMBER },
                  tax_amount: { type: Type.NUMBER },
                  classification_code: { type: Type.STRING, description: "Must match standard 5-digit MSIC format" }
                }
              }
            }
          },
          required: ["items"]
        }
      }
    });

    const extractionResult = tryRepairJSON(response.text || "{}");

    // 1. Write Initial Record (Simulating supabase-db-mcp)
    const client = await pool.connect();
    let invoiceId = "";
    try {
      const inv = extractionResult || {};
      const items = inv.items || [];
      
      let computedSubtotal = 0;
      let computedTaxTotal = 0;
      for (const item of items) {
        computedSubtotal += sanitizeNum(item.subtotal);
        computedTaxTotal += sanitizeNum(item.tax_amount);
      }
      const computedTotalPayable = computedSubtotal + computedTaxTotal;

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
            currentInvoiceNumber, inv.invoice_type_code || '01', documentType === 'image' ? 'pdf_upload' : 'whatsapp',
            inv.supplier_name || 'Extracted Vendor', inv.supplier_tin || 'C1234567890', inv.supplier_brn || '00000', '00000', 'General',
            '14', 'KL', '000', 'vendor@example.com',
            inv.buyer_name || 'General Public', inv.buyer_tin || 'EI00000000010', inv.buyer_brn || '000000000000', 
            (inv.buyer_tin && inv.buyer_tin !== 'EI00000000010') ? '14' : '17', '-',
            '-', '-',
            'MYR', 1.0, computedSubtotal, computedTaxTotal, computedTotalPayable,
            'Pending Extraction', computedTotalPayable >= 10000
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

      // Allowable tax_type values per schema CHECK constraint
      const VALID_TAX_TYPES = ['01', '02', '03', 'E', 'N/A'];
      for (const item of items) {
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
    await logMCPTool(invoiceId, 'supabase-db-mcp', 'write_invoice_record', 'Success', extractionResult, { invoice_id: invoiceId });

    // 2. Validate Phase 4 Limits via new API endpoint
    // We fetch the newly inserted invoice to get full data for validation
    const fullInvRes = await pool.query('SELECT * FROM invoices WHERE id = $1', [invoiceId]);
    const fullInv = fullInvRes.rows[0];
    
    // Call the external compliance guardrail endpoint we are building
    const validationUrl = new URL('/api/lhdn-sandbox/v1.1/documents/submissions', req.nextUrl.origin).toString();
    const valResRaw = await fetch(validationUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        invoiceId,
        invoice: fullInv,
        items: extractionResult.items || []
      })
    });
    const valRes = await valResRaw.json();

    let lhdnStatus = valRes.status || 'Validation Failed';
    let valErrors = valRes.errors || null;

    // 3. Generate QR via MCP call
    const qrRes = await callMCP('lhdn-validator-mcp', 'generate_lhdn_qr', { uuid: invoiceId, origin: req.nextUrl.origin }, invoiceId);
    let qrUrl = qrRes.result?.qr_url || null;

    // 4. Update Database with final LHDN status
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
    console.error("Agent Extraction Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function sanitizeNum(val: any): number {
  if (val === undefined || val === null) return 0;
  const num = typeof val === 'number' ? val : parseFloat(String(val));
  return Number.isFinite(num) ? num : 0;
}

function tryRepairJSON(jsonStr: string): any {
  try {
    return JSON.parse(jsonStr);
  } catch (e: any) {
    let cleaned = jsonStr.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.substring(7);
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.substring(3);
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.substring(0, cleaned.length - 3);
    }
    cleaned = cleaned.trim();

    try {
      return JSON.parse(cleaned);
    } catch (e2) {
      try {
        return parseTruncatedJSON(cleaned);
      } catch (e3: any) {
        throw new Error(`JSON parsing failed: ${e.message}. Attempted repair but got: ${e3.message}. Original text snippet: ${jsonStr.substring(0, 200)}...`);
      }
    }
  }
}

function parseTruncatedJSON(str: string): any {
  let cleanStr = str.trim();

  // 1. Close unclosed string literals at the end
  let openQuote = false;
  let escaped = false;
  for (let i = 0; i < cleanStr.length; i++) {
    if (cleanStr[i] === '\\' && !escaped) {
      escaped = true;
    } else {
      if (cleanStr[i] === '"' && !escaped) {
        openQuote = !openQuote;
      }
      escaped = false;
    }
  }

  if (openQuote) {
    cleanStr += '"';
  }

  // 2. Build the bracket/brace stack
  const stack: string[] = [];
  openQuote = false;
  escaped = false;

  for (let i = 0; i < cleanStr.length; i++) {
    const char = cleanStr[i];
    if (char === '\\' && !escaped) {
      escaped = true;
      continue;
    }
    if (char === '"' && !escaped) {
      openQuote = !openQuote;
    }
    escaped = false;

    if (!openQuote) {
      if (char === '{' || char === '[') {
        stack.push(char);
      } else if (char === '}') {
        if (stack[stack.length - 1] === '{') {
          stack.pop();
        }
      } else if (char === ']') {
        if (stack[stack.length - 1] === '[') {
          stack.pop();
        }
      }
    }
  }

  // 3. Clean up trailing commas, colons, or unclosed keys
  let repaired = cleanStr;
  while (true) {
    const temp = repaired.trim();
    if (temp.endsWith(',') || temp.endsWith(':')) {
      repaired = temp.slice(0, -1);
      continue;
    }
    if (temp.endsWith('"')) {
      const lastQuoteIdx = temp.lastIndexOf('"', temp.length - 2);
      if (lastQuoteIdx !== -1) {
        const preceding = temp.substring(0, lastQuoteIdx).trim();
        if (preceding.endsWith(',') || preceding.endsWith('{') || preceding.endsWith('[')) {
          repaired = preceding;
          if (repaired.endsWith(',')) {
            repaired = repaired.slice(0, -1);
          }
          continue;
        }
      }
    }
    break;
  }

  // 4. Close matching open brackets/braces
  while (stack.length > 0) {
    const lastOpen = stack.pop();
    if (lastOpen === '{') {
      repaired += '}';
    } else if (lastOpen === '[') {
      repaired += ']';
    }
  }

  return JSON.parse(repaired);
}
