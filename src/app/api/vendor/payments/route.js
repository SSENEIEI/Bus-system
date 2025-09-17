import { NextResponse } from 'next/server';
import { query, initDatabase } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

async function withInitRetry(action) {
  try { return await action(); } catch (err) {
    const msg = String(err?.message || '');
    const isNoTable = err?.code === 'ER_NO_SUCH_TABLE' || msg.includes("doesn't exist") || err?.sqlState === '42S02';
    if (!isNoTable) throw err;
    await initDatabase();
    return action();
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const the_date = searchParams.get('date');
  if (!the_date) return NextResponse.json({ error: 'missing date' }, { status: 400 });
  const rows = await withInitRetry(() => query(
    `SELECT the_date, route_id, pay_flat, pay_wait, pay_ot_normal, pay_trip, pay_ot_holiday, pay_trip_night
     FROM vendor_payments WHERE the_date = ?`,
    [the_date]
  ));
  return NextResponse.json(rows);
}

export async function POST(request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const isAdminga = String(user?.username || '').toLowerCase() === 'adminga' || !!user.is_super_admin;
  if (!isAdminga) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const body = await request.json();
  const { the_date, route_id, key, value } = body || {};
  if (!the_date || !route_id || !key) return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  const allowed = ['pay_flat','pay_wait','pay_ot_normal','pay_trip','pay_ot_holiday','pay_trip_night'];
  if (!allowed.includes(key)) return NextResponse.json({ error: 'bad key' }, { status: 400 });
  const val = Math.max(0, Number(value) || 0);
  await withInitRetry(() => query(
    `INSERT INTO vendor_payments (the_date, route_id, ${key}, updated_by)
     VALUES (?,?,?,?)
     ON DUPLICATE KEY UPDATE ${key}=VALUES(${key}), updated_by=VALUES(updated_by)`,
    [the_date, route_id, val, user.id || null]
  ));
  return NextResponse.json({ ok: true });
}
