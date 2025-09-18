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
  // Fetch daily rows
  // Attempt to fetch with new column pay_total_cars; fallback if column doesn't exist yet
  let dailyRows;
  try {
    dailyRows = await withInitRetry(() => query(
      `SELECT the_date, route_id, pay_flat, pay_wait, pay_total_cars, pay_ot_normal, pay_trip, pay_ot_holiday, pay_trip_night
       FROM vendor_payments WHERE the_date = ?`,
      [the_date]
    ));
  } catch (err) {
    const msg = String(err?.message || '');
    const isUnknown = err?.code === 'ER_BAD_FIELD_ERROR' || /Unknown column/i.test(msg);
    if (!isUnknown) throw err;
    dailyRows = await withInitRetry(() => query(
      `SELECT the_date, route_id, pay_flat, pay_wait, NULL AS pay_total_cars, pay_ot_normal, pay_trip, pay_ot_holiday, pay_trip_night
       FROM vendor_payments WHERE the_date = ?`,
      [the_date]
    ));
  }

  // Merge in monthly overrides for pay_flat if any
  const dt = new Date(the_date);
  const monthStart = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), 1)).toISOString().slice(0,10);
  const monthlyRows = await withInitRetry(() => query(
    `SELECT month_start, route_id, pay_flat FROM vendor_monthly_payments WHERE month_start = ?`,
    [monthStart]
  ));
  const monthlyMap = new Map(monthlyRows.map(r => [String(r.route_id), Number(r.pay_flat)||0]));

  // Build map of daily for quick override
  const byRoute = new Map();
  for (const r of dailyRows) byRoute.set(String(r.route_id), { ...r });
  // Ensure all routes with monthly exist in output
  for (const [routeId, flat] of monthlyMap.entries()) {
    const existing = byRoute.get(routeId);
    if (existing) {
      existing.pay_flat = flat; // override daily pay_flat with monthly
    } else {
      byRoute.set(routeId, { the_date, route_id: Number(routeId), pay_flat: flat, pay_wait: 0, pay_total_cars: 0, pay_ot_normal: 0, pay_trip: 0, pay_ot_holiday: 0, pay_trip_night: 0 });
    }
  }
  return NextResponse.json(Array.from(byRoute.values()));
}

export async function POST(request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const isAdminga = String(user?.username || '').toLowerCase() === 'adminga' || !!user.is_super_admin;
  if (!isAdminga) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const body = await request.json();
  const { the_date, route_id, key, value } = body || {};
  if (!the_date || !route_id || !key) return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  const allowed = ['pay_flat','pay_wait','pay_total_cars','pay_ot_normal','pay_trip','pay_ot_holiday','pay_trip_night'];
  if (!allowed.includes(key)) return NextResponse.json({ error: 'bad key' }, { status: 400 });
  const val = Math.max(0, Number(value) || 0);
  if (key === 'pay_flat') {
    // Save as a monthly value so it appears for all days in this month
    const dt = new Date(the_date);
    const monthStart = new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth(), 1)).toISOString().slice(0,10);
    await withInitRetry(() => query(
      `INSERT INTO vendor_monthly_payments (month_start, route_id, pay_flat, updated_by)
       VALUES (?,?,?,?)
       ON DUPLICATE KEY UPDATE pay_flat=VALUES(pay_flat), updated_by=VALUES(updated_by)`,
      [monthStart, route_id, val, user.id || null]
    ));
    // Also upsert the daily record for the current date to reflect immediately
    await withInitRetry(() => query(
      `INSERT INTO vendor_payments (the_date, route_id, pay_flat, updated_by)
       VALUES (?,?,?,?)
       ON DUPLICATE KEY UPDATE pay_flat=VALUES(pay_flat), updated_by=VALUES(updated_by)`,
      [the_date, route_id, val, user.id || null]
    ));
  } else {
    // Generic upsert; attempt with column. If column missing and it's pay_total_cars, try to add column automatically.
    try {
      await withInitRetry(() => query(
        `INSERT INTO vendor_payments (the_date, route_id, ${key}, updated_by)
         VALUES (?,?,?,?)
         ON DUPLICATE KEY UPDATE ${key}=VALUES(${key}), updated_by=VALUES(updated_by)`,
        [the_date, route_id, val, user.id || null]
      ));
    } catch (err) {
      const msg = String(err?.message || '');
      const isUnknown = err?.code === 'ER_BAD_FIELD_ERROR' || /Unknown column/i.test(msg);
      if (isUnknown && key === 'pay_total_cars') {
        // Try to ALTER table add column then retry
        try {
          await withInitRetry(() => query(`ALTER TABLE vendor_payments ADD COLUMN pay_total_cars INT NOT NULL DEFAULT 0`));
          await withInitRetry(() => query(
            `INSERT INTO vendor_payments (the_date, route_id, ${key}, updated_by)
             VALUES (?,?,?,?)
             ON DUPLICATE KEY UPDATE ${key}=VALUES(${key}), updated_by=VALUES(updated_by)`,
            [the_date, route_id, val, user.id || null]
          ));
        } catch (e2) {
          console.error('Failed to add pay_total_cars column:', e2?.message || e2);
          return NextResponse.json({ error: 'cannot add column pay_total_cars' }, { status: 500 });
        }
      } else {
        throw err;
      }
    }
  }
  return NextResponse.json({ ok: true });
}
