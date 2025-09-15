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
  const shift_id = Number(searchParams.get('shiftId')) || null;
  const depart_time_id = Number(searchParams.get('departTimeId')) || null;
  if (!the_date || !shift_id || !depart_time_id) {
    return NextResponse.json({ error: 'missing date/shiftId/departTimeId' }, { status: 400 });
  }
  const rows = await withInitRetry(() => query(
    `SELECT the_date, shift_id, depart_time_id, route_id, car_count FROM ot_car_plan
     WHERE the_date=? AND shift_id=? AND depart_time_id=?`,
    [the_date, shift_id, depart_time_id]
  ));
  return NextResponse.json(rows);
}

export async function POST(request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const isAdminga = String(user?.username||'').toLowerCase()==='adminga' || !!user.is_super_admin;
  if (!isAdminga) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const body = await request.json();
  const { the_date, shift_id, depart_time_id, route_id, car_count } = body || {};
  if (!the_date || !shift_id || !depart_time_id || !route_id) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }
  await withInitRetry(() => query(
    `INSERT INTO ot_car_plan (the_date, shift_id, depart_time_id, route_id, car_count, updated_by)
     VALUES (?,?,?,?,?,?)
     ON DUPLICATE KEY UPDATE car_count=VALUES(car_count), updated_by=VALUES(updated_by)`,
    [the_date, shift_id, depart_time_id, route_id, Math.max(0, Number(car_count)||0), user.id || null]
  ));
  return NextResponse.json({ ok: true });
}
