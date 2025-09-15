import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest, requireAdmin } from '@/lib/auth';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const shiftId = searchParams.get('shiftId');
  const rows = await query(
    shiftId
      ? 'SELECT id, shift_id, time, is_active FROM depart_times WHERE shift_id = ? ORDER BY time'
      : 'SELECT id, shift_id, time, is_active FROM depart_times ORDER BY shift_id, time',
    shiftId ? [shiftId] : []
  );
  return NextResponse.json(rows);
}

export async function POST(request) {
  const user = await getUserFromRequest(request);
  try { requireAdmin(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  const { shift_id, time, is_active = 1 } = await request.json();
  await query('INSERT INTO depart_times (shift_id, time, is_active) VALUES (?,?,?)', [shift_id, time, is_active ? 1 : 0]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request) {
  const user = await getUserFromRequest(request);
  try { requireAdmin(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
  await query('DELETE FROM depart_times WHERE id = ?', [id]);
  return NextResponse.json({ ok: true });
}
