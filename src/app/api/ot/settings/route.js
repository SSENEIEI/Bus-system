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
  const name = searchParams.get('name');
  if (!name) return NextResponse.json({ error: 'missing name' }, { status: 400 });
  const rows = await withInitRetry(() => query(`SELECT value FROM ot_settings WHERE name=?`, [name]));
  const value = rows.length ? rows[0].value : null;
  return NextResponse.json({ name, value });
}

export async function POST(request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const isAdminga = String(user?.username||'').toLowerCase()==='adminga' || !!user.is_super_admin;
  if (!isAdminga) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const body = await request.json();
  const { name, value } = body || {};
  if (!name) return NextResponse.json({ error: 'missing name' }, { status: 400 });
  await withInitRetry(() => query(`INSERT INTO ot_settings (name, value, updated_by) VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE value=VALUES(value), updated_by=VALUES(updated_by), updated_at=CURRENT_TIMESTAMP`, [name, String(value ?? ''), user.id || null]));
  return NextResponse.json({ ok: true });
}
