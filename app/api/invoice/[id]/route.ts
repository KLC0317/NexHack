import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { validateLHDNCompliance } from "../../lhdn-sandbox/v1.1/documents/submissions/route";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing invoice ID" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    const invoiceRes = await client.query(`SELECT * FROM invoices WHERE id = $1`, [id]);
    if (invoiceRes.rows.length === 0) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }
    const invoice = invoiceRes.rows[0];

    const itemsRes = await client.query(`SELECT * FROM invoice_items WHERE invoice_id = $1`, [id]);
    const items = itemsRes.rows;

    const logsRes = await client.query(`SELECT * FROM mcp_tool_logs WHERE invoice_id = $1 ORDER BY created_at ASC`, [id]);
    const logs = logsRes.rows;

    return NextResponse.json({ invoice, items, logs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Missing invoice ID" }, { status: 400 });
  }

  const { invoice, items } = await req.json();

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Recalculate status using the full LHDN compliance sandbox rules
    const { isValid, errors } = validateLHDNCompliance(invoice, items);
    
    let finalStatus = isValid ? "Validated" : "Validation Failed";
    let validationErrors = isValid ? null : errors;

    await client.query(`
      UPDATE invoices
      SET 
        invoice_number = $1,
        supplier_name = $2,
        supplier_tin = $3,
        supplier_brn = $4,
        supplier_state_code = $5,
        buyer_name = $6,
        buyer_tin = $7,
        buyer_brn = $8,
        buyer_state_code = $9,
        subtotal = $10,
        tax_total = $11,
        total_payable = $12,
        lhdn_status = $13,
        validation_errors = $14
      WHERE id = $15
    `, [
      invoice.invoice_number,
      invoice.supplier_name,
      invoice.supplier_tin,
      invoice.supplier_brn,
      invoice.supplier_state_code,
      invoice.buyer_name,
      invoice.buyer_tin,
      invoice.buyer_brn,
      invoice.buyer_state_code,
      parseFloat(invoice.subtotal || 0),
      parseFloat(invoice.tax_total || 0),
      parseFloat(invoice.total_payable || 0),
      finalStatus,
      validationErrors ? JSON.stringify(validationErrors) : null,
      id
    ]);

    // Replace items
    await client.query(`DELETE FROM invoice_items WHERE invoice_id = $1`, [id]);

    for (const item of items) {
      await client.query(`
        INSERT INTO invoice_items (
          invoice_id, description, quantity, unit_measurement,
          unit_price, subtotal, tax_type, tax_rate, tax_amount, classification_code
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        id,
        item.description,
        parseFloat(item.quantity || 1),
        item.unit_measurement || 'EA',
        parseFloat(item.unit_price || 0),
        parseFloat(item.subtotal || 0),
        item.tax_type || 'N/A',
        parseFloat(item.tax_rate || 0),
        parseFloat(item.tax_amount || 0),
        item.classification_code || '022'
      ]);
    }

    await client.query("COMMIT");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    await client.query("ROLLBACK");
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}
