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

function guard(user) {
  const isAdminga = String(user?.username || '').toLowerCase() === 'adminga';
  if (!(user?.is_super_admin || isAdminga)) {
    const e = new Error('forbidden'); e.status = 403; throw e;
  }
}

export async function GET() {
  const rows = await withInitRetry(() => query('SELECT id, name FROM employee_types ORDER BY name'));
  return NextResponse.json(rows);
}

export async function POST(request) {
  const user = await getUserFromRequest(request);
  try { guard(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  const { name } = await request.json();
  if (!name || !name.trim()) return NextResponse.json({ error: 'missing name' }, { status: 400 });
  await withInitRetry(() => query('INSERT INTO employee_types (name) VALUES (?)', [name.trim()]));
  return NextResponse.json({ ok: true });
}

export async function PUT(request) {
  const user = await getUserFromRequest(request);
  try { guard(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  const { id, name } = await request.json();
  if (!id || !name || !name.trim()) return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  await withInitRetry(() => query('UPDATE employee_types SET name=? WHERE id=?', [name.trim(), id]));
  return NextResponse.json({ ok: true });
}

export async function DELETE(request) {
  const user = await getUserFromRequest(request);
  try { guard(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
  await withInitRetry(() => query('DELETE FROM employee_types WHERE id=?', [id]));
  return NextResponse.json({ ok: true });
}
