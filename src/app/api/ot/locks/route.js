import { NextResponse } from 'next/server';
import { query, initDatabase } from '@/lib/db';
import { getUserFromRequest, requireAdmin } from '@/lib/auth';

// Helper: run a DB action, if table missing run init and retry once
async function withInitRetry(action) {
  try {
    return await action();
  } catch (err) {
    const msg = String(err?.message || '');
    const isNoTable = err?.code === 'ER_NO_SUCH_TABLE' || msg.includes("doesn't exist") || err?.sqlState === '42S02';
    if (!isNoTable) throw err;
    // Initialize schema (idempotent) and retry once
    await initDatabase();
    return action();
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const departmentId = searchParams.get('departmentId');
  const list = searchParams.get('list');
  const shiftId = searchParams.get('shiftId');
  const departTimeId = searchParams.get('departTimeId');
  if (!date) return NextResponse.json({ error: 'missing date' }, { status: 400 });
  // Time-slot scoped lock (global)
  if (shiftId && departTimeId && !departmentId) {
    const rows = await withInitRetry(() => query(
      'SELECT the_date, shift_id, depart_time_id, is_locked, locked_by_user_id, locked_at FROM ot_time_locks WHERE the_date=? AND shift_id=? AND depart_time_id=?',
      [date, Number(shiftId), Number(departTimeId)]
    ));
    return NextResponse.json(rows[0] || { the_date: date, shift_id: Number(shiftId), depart_time_id: Number(departTimeId), is_locked: 0 });
  }
  // Time-slot scoped lock per department
  if (shiftId && departTimeId && departmentId) {
    const rows = await withInitRetry(() => query(
      'SELECT the_date, department_id, shift_id, depart_time_id, is_locked, locked_by_user_id, locked_at FROM ot_department_time_locks WHERE the_date=? AND department_id=? AND shift_id=? AND depart_time_id=?',
      [date, Number(departmentId), Number(shiftId), Number(departTimeId)]
    ));
    return NextResponse.json(rows[0] || { the_date: date, department_id: Number(departmentId), shift_id: Number(shiftId), depart_time_id: Number(departTimeId), is_locked: 0 });
  }
  // Return list of department locks for the date
  if (list === 'departments') {
    const rows = await withInitRetry(() => query('SELECT the_date, department_id, is_locked, locked_by_user_id, locked_at FROM ot_department_locks WHERE the_date = ?', [date]));
    return NextResponse.json(rows);
  }
  // Return specific department lock
  if (departmentId) {
    const rows = await withInitRetry(() => query('SELECT the_date, department_id, is_locked, locked_by_user_id, locked_at FROM ot_department_locks WHERE the_date = ? AND department_id = ?', [date, Number(departmentId)]));
    return NextResponse.json(rows[0] || { the_date: date, department_id: Number(departmentId), is_locked: 0 });
  }
  // Default: global lock state
  const rows = await withInitRetry(() => query('SELECT the_date, is_locked, locked_by_user_id, locked_at FROM ot_locks WHERE the_date = ?', [date]));
  return NextResponse.json(rows[0] || { the_date: date, is_locked: 0 });
}

export async function POST(request) {
  const user = await getUserFromRequest(request);
  try { requireAdmin(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  const { the_date, is_locked, department_id, shift_id, depart_time_id } = await request.json();
  if (!the_date) return NextResponse.json({ error: 'missing the_date' }, { status: 400 });
  const lockedFlag = is_locked ? 1 : 0;
  const lockerId = Number(user?.id) > 0 ? Number(user.id) : null;
  // Department-level time lock
  if (department_id && shift_id && depart_time_id) {
    const deptId = Number(department_id);
    const shId = Number(shift_id);
    const dtId = Number(depart_time_id);
    if (!deptId || !shId || !dtId) return NextResponse.json({ error: 'invalid params' }, { status: 400 });
    const isSuper = !!user?.is_super_admin;
    if (!isSuper) {
      const myDeptIds = (Array.isArray(user?.department_ids) && user.department_ids.length)
        ? user.department_ids
        : (user?.department_id ? [user.department_id] : []);
      if (!myDeptIds.includes(deptId)) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
    if (lockedFlag) {
      await withInitRetry(() => query(
        `INSERT INTO ot_department_time_locks (the_date, department_id, shift_id, depart_time_id, is_locked, locked_by_user_id, locked_at)
         VALUES (?,?,?,?,1,?, NOW())
         ON DUPLICATE KEY UPDATE is_locked=VALUES(is_locked), locked_by_user_id=VALUES(locked_by_user_id), locked_at=NOW()`,
        [the_date, deptId, shId, dtId, lockerId]
      ));
    } else {
      await withInitRetry(() => query(
        `INSERT INTO ot_department_time_locks (the_date, department_id, shift_id, depart_time_id, is_locked, locked_by_user_id, locked_at)
         VALUES (?,?,?, ?,0,NULL,NULL)
         ON DUPLICATE KEY UPDATE is_locked=VALUES(is_locked), locked_by_user_id=NULL, locked_at=NULL`,
        [the_date, deptId, shId, dtId]
      ));
    }
    return NextResponse.json({ ok: true });
  }
  // Department-level lock (allowed for super admin or department-scoped admin)
  if (department_id) {
    const deptId = Number(department_id);
    if (!deptId) return NextResponse.json({ error: 'invalid department_id' }, { status: 400 });
    // Non-super admins can only lock/unlock their own department
    const isSuper = !!user?.is_super_admin;
    if (!isSuper) {
      const myDeptIds = (Array.isArray(user?.department_ids) && user.department_ids.length)
        ? user.department_ids
        : (user?.department_id ? [user.department_id] : []);
      if (!myDeptIds.includes(deptId)) {
        return NextResponse.json({ error: 'forbidden' }, { status: 403 });
      }
    }
    if (lockedFlag) {
      await withInitRetry(() => query(
        `INSERT INTO ot_department_locks (the_date, department_id, is_locked, locked_by_user_id, locked_at)
         VALUES (?,?,?,?, NOW())
         ON DUPLICATE KEY UPDATE is_locked = VALUES(is_locked), locked_by_user_id = VALUES(locked_by_user_id), locked_at = NOW()`,
        [the_date, deptId, 1, lockerId]
      ));
    } else {
      await withInitRetry(() => query(
        `INSERT INTO ot_department_locks (the_date, department_id, is_locked, locked_by_user_id, locked_at)
         VALUES (?,?,0,NULL,NULL)
         ON DUPLICATE KEY UPDATE is_locked = VALUES(is_locked), locked_by_user_id = NULL, locked_at = NULL`,
        [the_date, deptId]
      ));
    }
    return NextResponse.json({ ok: true });
  }
  // Global time-slot lock (super admin only)
  if (shift_id && depart_time_id) {
    if (!user?.is_super_admin) return NextResponse.json({ error: 'forbidden (super admin only for global time lock)' }, { status: 403 });
    const shId = Number(shift_id); const dtId = Number(depart_time_id);
    if (lockedFlag) {
      await withInitRetry(() => query(
        `INSERT INTO ot_time_locks (the_date, shift_id, depart_time_id, is_locked, locked_by_user_id, locked_at)
         VALUES (?,?,?,?,?, NOW())
         ON DUPLICATE KEY UPDATE is_locked=VALUES(is_locked), locked_by_user_id=VALUES(locked_by_user_id), locked_at=NOW()`,
        [the_date, shId, dtId, 1, lockerId]
      ));
    } else {
      await withInitRetry(() => query(
        `INSERT INTO ot_time_locks (the_date, shift_id, depart_time_id, is_locked, locked_by_user_id, locked_at)
         VALUES (?,?,?,0,NULL,NULL)
         ON DUPLICATE KEY UPDATE is_locked=VALUES(is_locked), locked_by_user_id=NULL, locked_at=NULL`,
        [the_date, shId, dtId]
      ));
    }
    return NextResponse.json({ ok: true });
  }
  // Global lock (super admin only)
  if (!user?.is_super_admin) {
    return NextResponse.json({ error: 'forbidden (super admin only for global lock)' }, { status: 403 });
  }
  if (lockedFlag) {
    await withInitRetry(() => query(
      `INSERT INTO ot_locks (the_date, is_locked, locked_by_user_id, locked_at)
       VALUES (?,?,?, NOW())
       ON DUPLICATE KEY UPDATE is_locked = VALUES(is_locked), locked_by_user_id = VALUES(locked_by_user_id), locked_at = NOW()`,
      [the_date, 1, lockerId]
    ));
  } else {
    await withInitRetry(() => query(
      `INSERT INTO ot_locks (the_date, is_locked, locked_by_user_id, locked_at)
       VALUES (?,?,NULL,NULL)
       ON DUPLICATE KEY UPDATE is_locked = VALUES(is_locked), locked_by_user_id = NULL, locked_at = NULL`,
      [the_date, 0]
    ));
  }
  return NextResponse.json({ ok: true });
}
