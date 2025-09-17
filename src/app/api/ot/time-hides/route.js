import { NextResponse } from 'next/server';
import { query, initDatabase } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

// Helper: run an action and, on missing-table errors, initialize schema then retry once
async function withInitRetry(action) {
  try {
    return await action();
  } catch (err) {
    const msg = String(err?.message || '');
    const isNoTable = err?.code === 'ER_NO_SUCH_TABLE' || msg.includes("doesn't exist") || err?.sqlState === '42S02';
    if (!isNoTable) throw err;
    await initDatabase();
    return action();
  }
}

// GET /api/ot/time-hides?date=YYYY-MM-DD&shiftId=1
// Returns an array of depart_time_id that are hidden for the given date/shift
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const the_date = searchParams.get('date');
  const shift_id = Number(searchParams.get('shiftId')) || null;
  if (!the_date || !shift_id) {
    return NextResponse.json({ error: 'missing date/shiftId' }, { status: 400 });
  }
  const rows = await withInitRetry(() => query(
    `SELECT depart_time_id FROM ot_time_hides WHERE the_date=? AND shift_id=?`,
    [the_date, shift_id]
  ));
  return NextResponse.json(rows.map(r => r.depart_time_id));
}

// POST /api/ot/time-hides
// Body: { the_date: 'YYYY-MM-DD', shift_id: number, depart_time_ids: number[] }
// Replaces all hidden times for that date/shift with the provided list
export async function POST(request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const isAdminga = String(user?.username || '').toLowerCase() === 'adminga' || !!user.is_super_admin;
  if (!isAdminga) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const body = await request.json();
  const { the_date, shift_id, depart_time_ids } = body || {};
  if (!the_date || !shift_id || !Array.isArray(depart_time_ids)) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }

  // Replace all hides for that date/shift
  await withInitRetry(() => query(
    `DELETE FROM ot_time_hides WHERE the_date=? AND shift_id=?`,
    [the_date, shift_id]
  ));

  if (depart_time_ids.length) {
    const values = depart_time_ids.map(id => [the_date, shift_id, id, user.id || null]);
    const placeholders = values.map(() => '(?,?,?,?)').join(',');
    await withInitRetry(() => query(
      `INSERT INTO ot_time_hides (the_date, shift_id, depart_time_id, hidden_by_user_id) VALUES ${placeholders}
       ON DUPLICATE KEY UPDATE hidden_by_user_id = VALUES(hidden_by_user_id), hidden_at = CURRENT_TIMESTAMP`,
      values.flat()
    ));
  }

  return NextResponse.json({ ok: true, count: depart_time_ids.length });
}
