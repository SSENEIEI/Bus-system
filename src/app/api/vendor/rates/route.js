import { NextResponse } from 'next/server';
import { query, initDatabase } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

async function withInitRetry(action) {
  try { return await action(); } catch (err) {
    const msg = String(err?.message || '');
    const isNoTable = err?.code === 'ER_NO_SUCH_TABLE' || msg.includes("doesn't exist") || err?.sqlState === '42S02';
    const isDBMissing = err?.code === 'ER_BAD_DB_ERROR' || /Unknown database/i.test(msg);
    if (!isNoTable && !isDBMissing) throw err;
    await initDatabase();
    return action();
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const route_id = Number(searchParams.get('route_id') || 0);
  if (!route_id) return NextResponse.json({ error: 'missing route_id' }, { status: 400 });
  let rows;
  try {
    rows = await withInitRetry(() => query(
      `SELECT route_id, rate_flat, rate_wait, rate_total_cars, rate_ot_normal, rate_trip, rate_ot_holiday, rate_trip_night
       FROM vendor_rates WHERE route_id = ?`,
      [route_id]
    ));
  } catch (err) {
    const msg = String(err?.message || '');
    const isUnknown = err?.code === 'ER_BAD_FIELD_ERROR' || /Unknown column/i.test(msg);
    if (!isUnknown) throw err;
    rows = await withInitRetry(() => query(
      `SELECT route_id, rate_flat, rate_wait, NULL AS rate_total_cars, rate_ot_normal, rate_trip, rate_ot_holiday, rate_trip_night
       FROM vendor_rates WHERE route_id = ?`,
      [route_id]
    ));
  }
  return NextResponse.json(rows[0] || { route_id, rate_flat:0, rate_wait:0, rate_total_cars:0, rate_ot_normal:0, rate_trip:0, rate_ot_holiday:0, rate_trip_night:0 });
}

export async function POST(request) {
  try {
    const user = await getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // Allow any authenticated user to update vendor rates (adjust if you need stricter roles)

    const body = await request.json().catch(() => ({}));
    const route_id = Number(body?.route_id || 0);
    const values = body?.values || {};
    if (!route_id || !values || typeof values !== 'object') {
      return NextResponse.json({ error: 'missing fields' }, { status: 400 });
    }
    const v = {
      rate_flat: Math.max(0, Number(values.rate_flat)||0),
      rate_wait: Math.max(0, Number(values.rate_wait)||0),
      rate_total_cars: Math.max(0, Number(values.rate_total_cars)||0),
      rate_ot_normal: Math.max(0, Number(values.rate_ot_normal)||0),
      rate_trip: Math.max(0, Number(values.rate_trip)||0),
      rate_ot_holiday: Math.max(0, Number(values.rate_ot_holiday)||0),
      rate_trip_night: Math.max(0, Number(values.rate_trip_night)||0),
    };
    try {
      await withInitRetry(() => query(
        `INSERT INTO vendor_rates (route_id, rate_flat, rate_wait, rate_total_cars, rate_ot_normal, rate_trip, rate_ot_holiday, rate_trip_night, updated_by)
         VALUES (?,?,?,?,?,?,?,?,?)
         ON DUPLICATE KEY UPDATE rate_flat=VALUES(rate_flat), rate_wait=VALUES(rate_wait), rate_total_cars=VALUES(rate_total_cars), rate_ot_normal=VALUES(rate_ot_normal), rate_trip=VALUES(rate_trip), rate_ot_holiday=VALUES(rate_ot_holiday), rate_trip_night=VALUES(rate_trip_night), updated_by=VALUES(updated_by)`,
        [route_id, v.rate_flat, v.rate_wait, v.rate_total_cars, v.rate_ot_normal, v.rate_trip, v.rate_ot_holiday, v.rate_trip_night, user.id || null]
      ));
    } catch (err) {
      const msg = String(err?.message || '');
      const isUnknownColumn = err?.code === 'ER_BAD_FIELD_ERROR' || /Unknown column/i.test(msg);
      if (isUnknownColumn) {
        // Attempt to add missing column(s) then retry once
        try {
          await withInitRetry(() => query(`ALTER TABLE vendor_rates ADD COLUMN rate_total_cars INT NOT NULL DEFAULT 0`));
        } catch (e2) {
          const m2 = String(e2?.message||'');
          // ignore if already exists (race condition)
          if (!/Duplicate|exists|errno 1060/i.test(m2)) {
            console.error('Failed adding rate_total_cars column:', m2);
          }
        }
        try {
          await withInitRetry(() => query(
            `INSERT INTO vendor_rates (route_id, rate_flat, rate_wait, rate_total_cars, rate_ot_normal, rate_trip, rate_ot_holiday, rate_trip_night, updated_by)
             VALUES (?,?,?,?,?,?,?,?,?)
             ON DUPLICATE KEY UPDATE rate_flat=VALUES(rate_flat), rate_wait=VALUES(rate_wait), rate_total_cars=VALUES(rate_total_cars), rate_ot_normal=VALUES(rate_ot_normal), rate_trip=VALUES(rate_trip), rate_ot_holiday=VALUES(rate_ot_holiday), rate_trip_night=VALUES(rate_trip_night), updated_by=VALUES(updated_by)`,
            [route_id, v.rate_flat, v.rate_wait, v.rate_total_cars, v.rate_ot_normal, v.rate_trip, v.rate_ot_holiday, v.rate_trip_night, user.id || null]
          ));
        } catch (e3) {
          // Fallback: try without updated_by columns OR if still unknown
          const m3 = String(e3?.message||'');
          const isUnknown2 = e3?.code === 'ER_BAD_FIELD_ERROR' || /Unknown column/i.test(m3);
          if (isUnknown2) {
            await withInitRetry(() => query(
              `INSERT INTO vendor_rates (route_id, rate_flat, rate_wait, rate_total_cars, rate_ot_normal, rate_trip, rate_ot_holiday, rate_trip_night)
               VALUES (?,?,?,?,?,?,?,?)
               ON DUPLICATE KEY UPDATE rate_flat=VALUES(rate_flat), rate_wait=VALUES(rate_wait), rate_total_cars=VALUES(rate_total_cars), rate_ot_normal=VALUES(rate_ot_normal), rate_trip=VALUES(rate_trip), rate_ot_holiday=VALUES(rate_ot_holiday), rate_trip_night=VALUES(rate_trip_night)`,
              [route_id, v.rate_flat, v.rate_wait, v.rate_total_cars, v.rate_ot_normal, v.rate_trip, v.rate_ot_holiday, v.rate_trip_night]
            ));
          } else {
            throw e3;
          }
        }
      } else {
        // Different error: still allow fallback without updated_by columns
        const isUnknownUpdatedBy = /Unknown column 'updated_by'/i.test(msg);
        if (isUnknownUpdatedBy) {
          await withInitRetry(() => query(
            `INSERT INTO vendor_rates (route_id, rate_flat, rate_wait, rate_total_cars, rate_ot_normal, rate_trip, rate_ot_holiday, rate_trip_night)
             VALUES (?,?,?,?,?,?,?,?)
             ON DUPLICATE KEY UPDATE rate_flat=VALUES(rate_flat), rate_wait=VALUES(rate_wait), rate_total_cars=VALUES(rate_total_cars), rate_ot_normal=VALUES(rate_ot_normal), rate_trip=VALUES(rate_trip), rate_ot_holiday=VALUES(rate_ot_holiday), rate_trip_night=VALUES(rate_trip_night)`,
            [route_id, v.rate_flat, v.rate_wait, v.rate_total_cars, v.rate_ot_normal, v.rate_trip, v.rate_ot_holiday, v.rate_trip_night]
          ));
        } else {
          throw err;
        }
      }
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('vendor_rates POST error:', err?.message || err);
    return NextResponse.json({ error: String(err?.message || 'internal error') }, { status: 500 });
  }
}
