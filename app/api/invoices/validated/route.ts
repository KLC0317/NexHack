import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  try {
    const client = await pool.connect();
    try {
      let query = `SELECT * FROM invoices WHERE lhdn_status = 'Validated'`;
      const params: any[] = [];
      
      if (startDate) {
        params.push(startDate);
        query += ` AND created_at >= $${params.length}`;
      }
      
      if (endDate) {
        params.push(endDate);
        // Add 1 day to end date to include the whole day
        query += ` AND created_at < ($${params.length}::date + interval '1 day')`;
      }

      query += ` ORDER BY created_at DESC`;

      const res = await client.query(query, params);
      return NextResponse.json({ invoices: res.rows });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("Failed to fetch validated invoices:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
