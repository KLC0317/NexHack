import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(req: NextRequest) {
  const client = await pool.connect();
  try {
    const res = await client.query(`SELECT * FROM invoices ORDER BY created_at DESC`);
    return NextResponse.json({ invoices: res.rows });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}
