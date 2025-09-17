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
    `SELECT np.the_date, np.shift_id, np.nurse_count, s.name_th, s.name_en
     FROM ot_nurse_plan np INNER JOIN shifts s ON s.id = np.shift_id
     WHERE np.the_date = ?
     ORDER BY s.id ASC`,
     [the_date]
  ));
  return NextResponse.json(rows);
}

export async function POST(request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const isAdminga = String(user?.username || '').toLowerCase() === 'adminga';
  if (!(user.is_super_admin || isAdminga)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const body = await request.json();
  const { the_date, items } = body || {};
  if (!the_date || !Array.isArray(items)) return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
  await withInitRetry(async () => {
    // Upsert each item
    for (const it of items) {
      const shift_id = Number(it.shift_id);
      const nurse_count = Math.max(0, Number(it.nurse_count)||0);
      await query(
        `INSERT INTO ot_nurse_plan (the_date, shift_id, nurse_count, updated_by)
         VALUES (?,?,?,?)
         ON DUPLICATE KEY UPDATE nurse_count=VALUES(nurse_count), updated_by=VALUES(updated_by)`,
        [the_date, shift_id, nurse_count, user.id || null]
      );
    }
  });
  return NextResponse.json({ ok: true });
}
