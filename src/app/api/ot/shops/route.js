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
  const rows = await withInitRetry(() => query(`SELECT the_date, rice_shops, minimart_shops, noodle_shops FROM ot_shop_plan WHERE the_date = ?`, [the_date]));
  return NextResponse.json(rows[0] || { the_date, rice_shops: 0, minimart_shops: 0, noodle_shops: 0 });
}

export async function POST(request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const isAdminga = String(user?.username || '').toLowerCase() === 'adminga';
  if (!(user.is_super_admin || isAdminga)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const body = await request.json();
  const { the_date, rice_shops=0, minimart_shops=0, noodle_shops=0 } = body || {};
  if (!the_date) return NextResponse.json({ error: 'missing date' }, { status: 400 });
  await withInitRetry(() => query(
    `INSERT INTO ot_shop_plan (the_date, rice_shops, minimart_shops, noodle_shops, updated_by)
     VALUES (?,?,?,?,?)
     ON DUPLICATE KEY UPDATE rice_shops=VALUES(rice_shops), minimart_shops=VALUES(minimart_shops), noodle_shops=VALUES(noodle_shops), updated_by=VALUES(updated_by)`,
    [the_date, Math.max(0, +rice_shops||0), Math.max(0, +minimart_shops||0), Math.max(0, +noodle_shops||0), user.id || null]
  ));
  return NextResponse.json({ ok: true });
}
