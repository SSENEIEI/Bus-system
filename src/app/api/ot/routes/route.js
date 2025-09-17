import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest, requireAdmin } from '@/lib/auth';

export async function GET() {
  const rows = await query('SELECT id, name, vendor, display_order FROM routes ORDER BY display_order, id');
  return NextResponse.json(rows);
}

export async function POST(request) {
  const user = await getUserFromRequest(request);
  try { requireAdmin(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  const { name, vendor = null, display_order = 0 } = await request.json();
  await query('INSERT INTO routes (name, vendor, display_order) VALUES (?,?,?)', [name, vendor, display_order]);
  return NextResponse.json({ ok: true });
}

export async function PUT(request) {
  const user = await getUserFromRequest(request);
  try { requireAdmin(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  const { id, name, vendor = null, display_order } = await request.json();
  await query('UPDATE routes SET name = ?, vendor = ?, display_order = ? WHERE id = ?', [name, vendor, display_order, id]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request) {
  const user = await getUserFromRequest(request);
  try { requireAdmin(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
  await query('DELETE FROM routes WHERE id = ?', [id]);
  return NextResponse.json({ ok: true });
}
