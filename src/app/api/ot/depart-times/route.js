import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getUserFromRequest, requireAdmin } from '@/lib/auth';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const shiftId = searchParams.get('shiftId');
  // Cleanup: auto-delete entries that were soft-hidden > 3 hours ago
  try {
    await query(`DELETE FROM depart_times WHERE is_active = 0 AND deactivated_at IS NOT NULL AND deactivated_at < DATE_SUB(NOW(), INTERVAL 3 HOUR)`);
  } catch {}
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
  // If exists (soft-hidden), reactivate; else insert
  const existing = await query('SELECT id FROM depart_times WHERE shift_id = ? AND time = ?', [shift_id, time]);
  if (existing.length) {
    await query('UPDATE depart_times SET is_active=?, deactivated_at=NULL WHERE id=?', [is_active ? 1 : 0, existing[0].id]);
  } else {
    await query('INSERT INTO depart_times (shift_id, time, is_active) VALUES (?,?,?)', [shift_id, time, is_active ? 1 : 0]);
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request) {
  const user = await getUserFromRequest(request);
  try { requireAdmin(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
  // Soft-hide: mark inactive and stamp deactivated_at; cascade delete will be handled after 3 hours by cleanup in GET (or future cron)
  await query('UPDATE depart_times SET is_active = 0, deactivated_at = NOW() WHERE id = ?', [id]);
  return NextResponse.json({ ok: true, softDeleted: true });
}

export async function PATCH(request) {
  const user = await getUserFromRequest(request);
  try { requireAdmin(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  const body = await request.json();
  const { id, is_active } = body || {};
  if (!id || typeof is_active === 'undefined') return NextResponse.json({ error: 'missing id or is_active' }, { status: 400 });
  if (is_active) {
    await query('UPDATE depart_times SET is_active = 1, deactivated_at = NULL WHERE id = ?', [id]);
  } else {
    await query('UPDATE depart_times SET is_active = 0, deactivated_at = NOW() WHERE id = ?', [id]);
  }
  return NextResponse.json({ ok: true });
}

export async function PUT(request) {
  const user = await getUserFromRequest(request);
  try { requireAdmin(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  const { id, time, shift_id } = await request.json();
  if (!id || !time) return NextResponse.json({ error: 'missing id or time' }, { status: 400 });
  try {
    // Determine target shift
    let targetShiftId = shift_id;
    if (!targetShiftId) {
      const rows = await query('SELECT shift_id FROM depart_times WHERE id = ?', [id]);
      if (!rows.length) return NextResponse.json({ error: 'not found' }, { status: 404 });
      targetShiftId = rows[0].shift_id;
    }
    // Normalize time to HH:MM:SS if only HH:MM provided
    const normTime = time.length === 5 ? `${time}:00` : time;
    // Guard against duplicates within same shift
    const dup = await query('SELECT id FROM depart_times WHERE shift_id = ? AND time = ? AND id <> ?', [targetShiftId, normTime, id]);
    if (dup.length) return NextResponse.json({ error: 'มีเวลาออกนี้อยู่แล้วในกะนี้' }, { status: 409 });
    await query('UPDATE depart_times SET shift_id = ?, time = ?, is_active = 1, deactivated_at = NULL WHERE id = ?', [targetShiftId, normTime, id]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = String(e && e.message || e);
    const isDup = /Duplicate|unique|uniq_shift_time/i.test(msg);
    return NextResponse.json({ error: isDup ? 'มีเวลาออกนี้อยู่แล้วในกะนี้' : 'อัปเดตเวลาออกล้มเหลว' }, { status: isDup ? 409 : 500 });
  }
}
