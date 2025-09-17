import { NextResponse } from 'next/server';
import { query, initDatabase } from '@/lib/db';

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

// GET /api/ot/summary?date=YYYY-MM-DD
// Returns rows: [{ shift_id, department_id, total }]
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const the_date = searchParams.get('date');
  if (!the_date) {
    return NextResponse.json({ error: 'missing date' }, { status: 400 });
  }
  const rows = await withInitRetry(() => query(
    `SELECT shift_id, department_id, SUM(count) AS total
     FROM ot_counts
     WHERE the_date = ?
     GROUP BY shift_id, department_id`,
    [the_date]
  ));
  return NextResponse.json(rows);
}
