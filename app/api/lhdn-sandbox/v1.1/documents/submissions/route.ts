import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export function validateLHDNCompliance(invoice: any, items: any[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Rule 1: The RM10,000 Consolidation Limit (Phase 4 Law) [cite: 1.3.1]
  // Consolidated invoices use Buyer TIN 'EI00000000010'. 
  // If Total Payable >= 10000.00, it MUST NOT use the consolidated TIN [cite: 1.2.3, 1.3.1].
  const totalPayable = invoice.total_payable || 0;
  if (totalPayable >= 10000.00 && invoice.buyer_tin === 'EI00000000010') {
    errors.push(
      "CONSL_ERR: Consolidated e-Invoicing is legally prohibited for single transactions exceeding RM10,000. Please obtain and provide the buyer's individual TIN."
    );
  }

  // Rule 2: State Code 17 Restriction
  // LHDN State code '17' represents 'Wilayah Persekutuan Putrajaya' but in submissions it is strictly restricted 
  // only to foreign/cross-border transactions or consolidated profiles.
  if (invoice.buyer_state_code === '17' && invoice.buyer_tin !== 'EI00000000010' && invoice.currency_code === 'MYR') {
    errors.push(
      "STATE_ERR: State Code 17 is reserved for consolidated invoices or international transactions. Please assign a valid domestic state code (e.g. '14' for KL, '10' for Selangor)."
    );
  }

  // Rule 3: Numeric format checks (No Scientific Notation)
  // Check if total fields contain "e+" or "E+" indicating floating-point scientific notation
  const totalString = invoice.total_payable?.toString() || "";
  if (totalString.toLowerCase().includes('e')) {
    errors.push("FORMAT_ERR: Numeric values must be plain decimals. Scientific floating-point notation is rejected by LHDN API.");
  }
  // Rule 4-7: Strict SST and Math Verification
  const validTaxTypes = ['01', '02', '06', 'E', 'N/A'];
  let calculatedTaxTotal = 0;

  if (items && Array.isArray(items)) {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const taxType = item.tax_type || 'N/A';
      const taxRate = parseFloat(item.tax_rate) || 0;
      const taxAmount = parseFloat(item.tax_amount) || 0;
      const subtotal = parseFloat(item.subtotal) || 0;

      // Rule 4: Tax Type Verification
      if (!validTaxTypes.includes(taxType)) {
        errors.push(`TAX_TYPE_ERR: Item ${i+1} uses an unrecognized Tax Type '${taxType}'. Valid types are 01 (Sales Tax), 02 (Service Tax), 06 (Not Applicable), or E (Exempt).`);
      }

      // Rule 5: Zero-Tax Exemption Integrity
      if ((taxType === '06' || taxType === 'E' || taxType === 'N/A') && (taxRate !== 0 || taxAmount !== 0)) {
        errors.push(`TAX_EXEMPT_ERR: Item ${i+1} claims Exemption/NA (Type ${taxType}) but specifies a non-zero tax rate (${taxRate}%) or tax amount (RM${taxAmount}).`);
      }

      // Rule 6: Line Item SST Mathematical Verification
      if (taxType === '01' || taxType === '02') {
        const expectedTax = subtotal * (taxRate / 100);
        const diff = Math.abs(expectedTax - taxAmount);
        if (diff > 0.05) { // 0.05 tolerance for floating points and rounding
           errors.push(`MATH_LINE_ERR: Item ${i+1} mathematical discrepancy. Subtotal RM${subtotal} * ${taxRate}% = RM${expectedTax.toFixed(2)}, but submitted tax amount is RM${taxAmount.toFixed(2)}.`);
        }
      }

      calculatedTaxTotal += taxAmount;
    }
  }

  // Rule 7: Invoice Total Integrity
  const submittedTaxTotal = parseFloat(invoice.tax_total) || 0;
  const submittedSubtotal = parseFloat(invoice.subtotal) || 0;
  const submittedTotalPayable = parseFloat(invoice.total_payable) || 0;

  if (Math.abs(calculatedTaxTotal - submittedTaxTotal) > 0.05) {
    errors.push(`MATH_TOTAL_ERR: Invoice Tax Total (RM${submittedTaxTotal.toFixed(2)}) does not equal the sum of item tax amounts (RM${calculatedTaxTotal.toFixed(2)}).`);
  }

  const expectedTotalPayable = submittedSubtotal + submittedTaxTotal;
  if (Math.abs(expectedTotalPayable - submittedTotalPayable) > 0.05) {
    errors.push(`MATH_TOTAL_ERR: Invoice Total Payable (RM${submittedTotalPayable.toFixed(2)}) does not equal Subtotal + Tax Total (RM${expectedTotalPayable.toFixed(2)}).`);
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}

export async function POST(req: NextRequest) {
  try {
    const { invoiceId, invoice, items } = await req.json();

    const { isValid, errors } = validateLHDNCompliance(invoice, items);

    const status = isValid ? "Validated" : "Validation Failed";

    if (invoiceId) {
      const client = await pool.connect();
      try {
        if (!isValid) {
          await client.query(`
            UPDATE invoices 
            SET lhdn_status = $1, validation_errors = $2
            WHERE id = $3
          `, ['Validation Failed', JSON.stringify(errors), invoiceId]);
        }

        // Log the tool invocation
        await client.query(`
          INSERT INTO mcp_tool_logs (invoice_id, mcp_server, tool_name, status, input_payload, output_response)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [
          invoiceId, 
          'lhdn-sandbox', 
          'validateLHDNCompliance', 
          isValid ? 'Success' : 'Error', 
          JSON.stringify({ invoice, items }), 
          JSON.stringify({ isValid, errors })
        ]);
      } finally {
        client.release();
      }
    }

    return NextResponse.json({ success: true, isValid, status, errors });
  } catch (error: any) {
    console.error("LHDN Sandbox Validation Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
