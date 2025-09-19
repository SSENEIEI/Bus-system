import { NextResponse } from 'next/server';
import { query, initDatabase } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const the_date = searchParams.get('date');
  const shift_id = searchParams.get('shiftId');
  const depart_time_id = searchParams.get('departTimeId');
  if (!the_date || !shift_id || !depart_time_id) {
    return NextResponse.json({ error: 'missing date/shiftId/departTimeId' }, { status: 400 });
  }
  const rows = await withInitRetry(() => query(
    `SELECT oc.id, oc.the_date, oc.route_id, oc.plant_id, oc.department_id, oc.shift_id, oc.depart_time_id, oc.count
     FROM ot_counts oc
     WHERE oc.the_date = ? AND oc.shift_id = ? AND oc.depart_time_id = ?`,
    [the_date, shift_id, depart_time_id]
  ));
  return NextResponse.json(rows);
}

export async function POST(request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { the_date, route_id, plant_id, department_id, shift_id, depart_time_id, count } = await request.json();
  if (!the_date || !route_id || !plant_id || !department_id || !shift_id || !depart_time_id) {
    return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  }
  // Lock check with precedence and explicit unlock override
  // Precedence: (1) Global time-slot lock (highest) -> (2) Dept time-slot lock -> (3) Dept day lock -> (4) Global day lock
  // Explicit time-slot unlock rows (is_locked=0) override day-level locks.
  const isAdminga = String(user?.username || '').toLowerCase() === 'adminga';
  let effectiveLocked = false;
  // 1) Global time-slot lock
  const timeRows = await withInitRetry(() => query(
    'SELECT is_locked FROM ot_time_locks WHERE the_date=? AND shift_id=? AND depart_time_id=?',
    [the_date, Number(shift_id), Number(depart_time_id)]
  ));
  if (timeRows.length) {
    if (Number(timeRows[0].is_locked) === 1) effectiveLocked = true;
    else effectiveLocked = false; // explicit unlock overrides day-level
  } else {
    // 2) Department time-slot lock (consider only if no explicit global time row)
    const deptTimeRows = await withInitRetry(() => query(
      'SELECT is_locked FROM ot_department_time_locks WHERE the_date=? AND department_id=? AND shift_id=? AND depart_time_id=?',
      [the_date, Number(department_id), Number(shift_id), Number(depart_time_id)]
    ));
    if (deptTimeRows.length) {
      effectiveLocked = Number(deptTimeRows[0].is_locked) === 1;
    } else {
      // 3) Department day-level lock
      const deptDayRows = await withInitRetry(() => query(
        'SELECT is_locked FROM ot_department_locks WHERE the_date=? AND department_id=?',
        [the_date, Number(department_id)]
      ));
      if (deptDayRows.length) {
        effectiveLocked = Number(deptDayRows[0].is_locked) === 1;
      } else {
        // 4) Global day-level lock
        const dayRows = await withInitRetry(() => query(
          'SELECT is_locked FROM ot_locks WHERE the_date=?',
          [the_date]
        ));
        effectiveLocked = dayRows.length ? Number(dayRows[0].is_locked) === 1 : false;
      }
    }
  }
  if (effectiveLocked && !(user.is_super_admin || isAdminga)) {
    return NextResponse.json({ error: 'locked' }, { status: 423 });
  }
  // Scope check: only super admin can write anywhere; others must match their plant and be in one of their departments
  const isSuper = !!(user.is_super_admin || isAdminga);
  if (!isSuper) {
    const myDeptIds = (Array.isArray(user?.department_ids) && user.department_ids.length)
      ? user.department_ids
      : (user?.department_id ? [user.department_id] : []);
    if (user.plant_id !== plant_id || !myDeptIds.includes(Number(department_id))) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
  }
  // Upsert
  await withInitRetry(() => query(
    `INSERT INTO ot_counts (the_date, route_id, plant_id, department_id, shift_id, depart_time_id, count)
     VALUES (?,?,?,?,?,?,?)
     ON DUPLICATE KEY UPDATE count = VALUES(count)`,
    [the_date, route_id, plant_id, department_id, shift_id, depart_time_id, Math.max(0, Number(count) || 0)]
  ));
  return NextResponse.json({ ok: true });
}
