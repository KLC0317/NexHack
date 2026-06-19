import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const invoiceId = searchParams.get('invoiceId');

  if (!invoiceId) {
    return NextResponse.json({ error: "Missing invoiceId" }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT * FROM mcp_tool_logs
      WHERE invoice_id = $1
      ORDER BY created_at ASC
    `, [invoiceId]);
    return NextResponse.json(res.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}
