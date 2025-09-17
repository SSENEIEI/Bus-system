import { NextResponse } from 'next/server';
import { query, initDatabase } from '@/lib/db';
import { getUserFromRequest, requireAdmin } from '@/lib/auth';

async function withInitRetry(fn) {
  try {
    return await fn();
  } catch (e) {
    const msg = String(e && e.message || e);
    const isSchemaErr = /Unknown column|ER_BAD_FIELD_ERROR|doesn't exist|ER_NO_SUCH_TABLE/i.test(msg);
    if (isSchemaErr) {
      await initDatabase({ seed: false }).catch(()=>{});
      return await fn();
    }
    throw e;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const shiftId = searchParams.get('shiftId');
  // By default, return only active times. Pass active=0 to include inactive as well.
  const onlyActive = (searchParams.get('active') ?? '1') !== '0';
  const rows = await withInitRetry(() => query(
    shiftId
      ? (onlyActive
          ? 'SELECT id, shift_id, time, is_active, is_entry FROM depart_times WHERE shift_id = ? AND is_active <> 0 ORDER BY is_entry DESC, time'
          : 'SELECT id, shift_id, time, is_active, is_entry FROM depart_times WHERE shift_id = ? ORDER BY is_entry DESC, time')
      : (onlyActive
          ? 'SELECT id, shift_id, time, is_active, is_entry FROM depart_times WHERE is_active <> 0 ORDER BY shift_id, is_entry DESC, time'
          : 'SELECT id, shift_id, time, is_active, is_entry FROM depart_times ORDER BY shift_id, is_entry DESC, time'),
    shiftId ? [shiftId] : []
  ));
  return NextResponse.json(rows);
}

export async function POST(request) {
  const user = await getUserFromRequest(request);
  try { requireAdmin(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  const { shift_id, time, is_entry = 0 } = await request.json();
  // Guard against duplicates
  const normTime = time.length === 5 ? `${time}:00` : time;
  const existing = await withInitRetry(() => query('SELECT id FROM depart_times WHERE shift_id = ? AND time = ? AND is_entry = ?', [shift_id, normTime, is_entry ? 1 : 0]));
  if (existing.length) {
    return NextResponse.json({ error: is_entry ? 'มีเวลาเข้าเวลานี้อยู่แล้วในกะนี้' : 'มีเวลาออกเวลานี้อยู่แล้วในกะนี้' }, { status: 409 });
  }
  await withInitRetry(() => query('INSERT INTO depart_times (shift_id, time, is_entry, is_active) VALUES (?,?,?,1)', [shift_id, normTime, is_entry ? 1 : 0]));
  return NextResponse.json({ ok: true });
}

export async function DELETE(request) {
  const user = await getUserFromRequest(request);
  try { requireAdmin(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
  // Hard delete: remove row immediately (cascades to related tables via FK ON DELETE CASCADE)
  await withInitRetry(() => query('DELETE FROM depart_times WHERE id = ?', [id]));
  return NextResponse.json({ ok: true, deleted: true });
}

export async function PATCH(request) {
  const user = await getUserFromRequest(request);
  try { requireAdmin(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  const body = await request.json();
  const { id, is_active } = body || {};
  if (!id || typeof is_active === 'undefined') return NextResponse.json({ error: 'missing id or is_active' }, { status: 400 });
  if (is_active) {
    await withInitRetry(() => query('UPDATE depart_times SET is_active = 1, deactivated_at = NULL WHERE id = ?', [id]));
  } else {
    await withInitRetry(() => query('UPDATE depart_times SET is_active = 0, deactivated_at = NOW() WHERE id = ?', [id]));
  }
  return NextResponse.json({ ok: true });
}

export async function PUT(request) {
  const user = await getUserFromRequest(request);
  try { requireAdmin(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  const { id, time, shift_id, is_entry } = await request.json();
  if (!id || !time) return NextResponse.json({ error: 'missing id or time' }, { status: 400 });
  try {
    // Determine target shift
    let targetShiftId = shift_id;
    if (!targetShiftId) {
      const rows = await withInitRetry(() => query('SELECT shift_id, is_entry FROM depart_times WHERE id = ?', [id]));
      if (!rows.length) return NextResponse.json({ error: 'not found' }, { status: 404 });
      targetShiftId = rows[0].shift_id;
      if (typeof is_entry === 'undefined') {
        // keep existing value if not provided
        await withInitRetry(() => query('SET @keep_is_entry := ?', [rows[0].is_entry]));
      }
    }
    // Normalize time to HH:MM:SS if only HH:MM provided
    const normTime = time.length === 5 ? `${time}:00` : time;
    // Guard against duplicates within same shift
    const entryFlag = (typeof is_entry === 'undefined') ? (await withInitRetry(() => query('SELECT is_entry FROM depart_times WHERE id=?',[id])))[0]?.is_entry : (is_entry ? 1 : 0);
    const dup = await withInitRetry(() => query('SELECT id FROM depart_times WHERE shift_id = ? AND time = ? AND is_entry = ? AND id <> ?', [targetShiftId, normTime, entryFlag, id]));
    if (dup.length) return NextResponse.json({ error: 'มีเวลาออกนี้อยู่แล้วในกะนี้' }, { status: 409 });
    await withInitRetry(() => query('UPDATE depart_times SET shift_id = ?, time = ?, is_entry = ? WHERE id = ?', [targetShiftId, normTime, entryFlag, id]));
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = String(e && e.message || e);
    const isDup = /Duplicate|unique|uniq_shift_time|uniq_shift_time_type/i.test(msg);
    return NextResponse.json({ error: isDup ? 'เวลา (เข้า/ออก) ซ้ำในกะนี้' : 'อัปเดตเวลาออกล้มเหลว' }, { status: isDup ? 409 : 500 });
  }
}
