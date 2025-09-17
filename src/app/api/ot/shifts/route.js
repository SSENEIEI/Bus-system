import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest, requireAdmin } from '@/lib/auth';

export async function GET() {
  const rows = await query('SELECT id, name_th, name_en, is_active FROM shifts ORDER BY id');
  return NextResponse.json(rows);
}

export async function POST(request) {
  const user = await getUserFromRequest(request);
  try { requireAdmin(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  const body = await request.json();
  const { name_th, name_en, is_active = 1 } = body;
  await query('INSERT INTO shifts (name_th, name_en, is_active) VALUES (?,?,?)', [name_th, name_en || null, is_active ? 1 : 0]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request) {
  const user = await getUserFromRequest(request);
  try { requireAdmin(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
  await query('DELETE FROM shifts WHERE id = ?', [id]);
  return NextResponse.json({ ok: true });
}
