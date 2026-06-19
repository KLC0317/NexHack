import { NextRequest, NextResponse } from "next/server";
import { MCPRequest, createMCPResponse, createMCPError } from "../../../lib/mcp/types";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: NextRequest) {
  try {
    const mcpReq: MCPRequest = await req.json();

    if (mcpReq.method === "tools/call") {
      const { name, parameters } = mcpReq.params;

      // 1. lhdn-validator-mcp: validate_ubl_invoice
      if (name === "validate_ubl_invoice") {
        const { invoice } = parameters;
        const total = parseFloat(invoice.total_payable);
        let isValid = true;
        let errors = [];

        // Phase 4 Rule: Block consolidated items >= RM10,000
        if (invoice.buyer_tin === "EI00000000010" && total >= 10000) {
          isValid = false;
          errors.push({
            code: "PHASE4_LIMIT_EXCEEDED",
            message: "Consolidated invoices cannot exceed RM10,000.",
          });
        }

        // Delay to simulate processing
        await new Promise((resolve) => setTimeout(resolve, 800));

        return NextResponse.json(
          createMCPResponse(mcpReq.id, {
            status: isValid ? "Validated" : "Validation Failed",
            errors: errors.length > 0 ? errors : null,
          })
        );
      }

      // 2. lhdn-validator-mcp: generate_lhdn_qr
      if (name === "generate_lhdn_qr") {
        const { uuid } = parameters;
        await new Promise((resolve) => setTimeout(resolve, 500));
        return NextResponse.json(
          createMCPResponse(mcpReq.id, {
            qr_url: `${req.nextUrl.origin}/verify/${uuid}`,
          })
        );
      }

      // 3. supabase-db-mcp: write_invoice_record
      if (name === "write_invoice_record") {
        const { invoice, items } = parameters;
        const client = await pool.connect();
        try {
          await client.query("BEGIN");
          
          const insertInvoiceQuery = `
            INSERT INTO invoices (
              invoice_number, invoice_type_code, raw_input_type,
              supplier_name, supplier_tin, supplier_brn, supplier_msic_code, supplier_msic_desc,
              supplier_state_code, supplier_address, supplier_contact, supplier_email,
              buyer_name, buyer_tin, buyer_brn, buyer_state_code, buyer_address,
              buyer_contact, buyer_email,
              currency_code, exchange_rate, subtotal, tax_total, total_payable,
              lhdn_status
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25
            ) RETURNING id
          `;
          const invoiceValues = [
            invoice.invoice_number || `INV-${Date.now()}`,
            invoice.invoice_type_code || '01',
            invoice.raw_input_type || 'pdf_upload',
            invoice.supplier_name || 'MyInvoisAI Demo Vendor',
            invoice.supplier_tin || 'C1234567890',
            invoice.supplier_brn || '202001000000',
            invoice.supplier_msic_code || '00000',
            invoice.supplier_msic_desc || 'General',
            invoice.supplier_state_code || '14',
            invoice.supplier_address || 'Kuala Lumpur',
            invoice.supplier_contact || '03-12345678',
            invoice.supplier_email || 'vendor@example.com',
            invoice.buyer_name || 'General Public',
            invoice.buyer_tin || 'EI00000000010',
            invoice.buyer_brn || '000000000000',
            invoice.buyer_state_code || '17',
            invoice.buyer_address || 'Malaysia',
            invoice.buyer_contact || '012-3456789',
            invoice.buyer_email || 'buyer@example.com',
            invoice.currency_code || 'MYR',
            invoice.exchange_rate || 1.0,
            invoice.subtotal || 0,
            invoice.tax_total || 0,
            invoice.total_payable || 0,
            invoice.lhdn_status || 'Pending Extraction'
          ];
          
          const invoiceRes = await client.query(insertInvoiceQuery, invoiceValues);
          const invoiceId = invoiceRes.rows[0].id;

          if (items && items.length > 0) {
            const insertItemQuery = `
              INSERT INTO invoice_items (
                invoice_id, description, quantity, unit_measurement,
                unit_price, subtotal, tax_type, tax_rate, tax_amount, classification_code
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            `;
            for (const item of items) {
              await client.query(insertItemQuery, [
                invoiceId,
                item.description || 'Item',
                item.quantity || 1,
                item.unit_measurement || 'EA',
                item.unit_price || 0,
                item.subtotal || 0,
                item.tax_type || 'E',
                item.tax_rate || 0,
                item.tax_amount || 0,
                item.classification_code || '022'
              ]);
            }
          }

          await client.query("COMMIT");
          return NextResponse.json(createMCPResponse(mcpReq.id, { invoice_id: invoiceId }));
        } catch (e: any) {
          await client.query("ROLLBACK");
          console.error("DB Error:", e);
          return NextResponse.json(createMCPError(mcpReq.id, 500, "Database Error", e.message));
        } finally {
          client.release();
        }
      }

      // 4. supabase-db-mcp: log_mcp_tool
      if (name === "log_mcp_tool") {
         const { invoice_id, mcp_server, tool_name, status, input_payload, output_response } = parameters;
         const client = await pool.connect();
         try {
           await client.query(`
             INSERT INTO mcp_tool_logs (invoice_id, mcp_server, tool_name, status, input_payload, output_response)
             VALUES ($1, $2, $3, $4, $5, $6)
           `, [invoice_id, mcp_server, tool_name, status, JSON.stringify(input_payload), JSON.stringify(output_response)]);
           return NextResponse.json(createMCPResponse(mcpReq.id, { success: true }));
         } catch(e: any) {
           console.error("Log DB Error:", e);
           return NextResponse.json(createMCPError(mcpReq.id, 500, "Database Error", e.message));
         } finally {
           client.release();
         }
      }

      return NextResponse.json(createMCPError(mcpReq.id, 404, `Method not found: ${name}`));
    }

    return NextResponse.json(createMCPError(mcpReq.id, 400, "Invalid MCP Request"));
  } catch (error: any) {
    console.error("MCP Router Error:", error);
    return NextResponse.json({ jsonrpc: "2.0", id: null, error: { code: 500, message: "Internal Server Error" } }, { status: 500 });
  }
}
