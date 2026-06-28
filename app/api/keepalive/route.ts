import { NextResponse } from 'next/server';
import { Client } from 'pg';

// Force dynamic execution (no static caching)
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  let client: Client | null = null;
  
  try {
    // 1. Verify Vercel Cron authorization
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      console.warn('CRON_SECRET environment variable is not set. Keep-alive endpoint is insecure.');
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Initialize Postgres client using DATABASE_URL
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 500 });
    }

    client = new Client({
      connectionString,
    });

    await client.connect();

    // 3. Execute lightweight query to keep Supabase project active
    await client.query('SELECT 1');

    return NextResponse.json({ 
      success: true, 
      message: 'Supabase keep-alive executed successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Keep-alive endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  } finally {
    if (client) {
      await client.end().catch(console.error);
    }
  }
}
