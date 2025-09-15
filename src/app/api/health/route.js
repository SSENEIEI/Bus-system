import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/db';

export async function GET() {
  try {
    const ok = await testConnection();
    const jwtConfigured = !!process.env.JWT_SECRET;
    const payload = { status: 'ok', db: ok, jwtConfigured };
    // If running without JWT configured, surface as 500 in non-dev to prevent accidental exposure
    const isProd = process.env.NODE_ENV === 'production';
    if (!jwtConfigured && isProd) {
      return NextResponse.json({ ...payload, status: 'error', error: 'Missing JWT_SECRET' }, { status: 500 });
    }
    return NextResponse.json(payload);
  } catch (e) {
    return NextResponse.json({ status: 'error', error: e.message }, { status: 500 });
  }
}
