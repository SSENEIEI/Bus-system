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

function guard(user) {
  const isAdminga = String(user?.username || '').toLowerCase() === 'adminga';
  if (!(user?.is_super_admin || isAdminga)) {
    const e = new Error('forbidden'); e.status = 403; throw e;
  }
}

export async function GET(request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try { guard(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format');
  const q = searchParams.get('q');
  const where = q ? `WHERE employee_code LIKE ? OR full_name LIKE ? OR pickup_point LIKE ?` : '';
  const params = q ? [`%${q}%`, `%${q}%`, `%${q}%`] : [];
  const rows = await withInitRetry(() => query(
    `SELECT tr.*, p.code AS plant_code, d.code AS dept_code, r.name AS route_name
     FROM transport_registrations tr
     LEFT JOIN plants p ON p.id = tr.plant_id
     LEFT JOIN departments d ON d.id = tr.department_id
     LEFT JOIN routes r ON r.id = tr.route_id
     ${where}
     ORDER BY tr.id DESC`, params));

  if (format === 'csv') {
    const header = ['employee_code','full_name','employee_type','plant','department','route','pickup_point'];
    const lines = [header.join(',')];
    for (const r of rows) {
      const line = [r.employee_code, r.full_name, r.employee_type||'', r.plant_code||'', r.dept_code||'', r.route_name||'', r.pickup_point||'']
        .map(v => String(v).replaceAll('"','""'))
        .map(v => /,|\n|\"/.test(v) ? `"${v}"` : v)
        .join(',');
      lines.push(line);
    }
    const csv = lines.join('\n');
    return new NextResponse(csv, { headers: { 'Content-Type':'text/csv; charset=utf-8', 'Content-Disposition':'attachment; filename="transport-registrations.csv"' } });
  }
  return NextResponse.json(rows);
}

export async function POST(request) {
  const user = await getUserFromRequest(request);
  // Allow any authenticated user (not only adminga) to submit a registration
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  const { employee_code, full_name, employee_type=null, plant_id=null, department_id=null, route_id=null, pickup_point=null } = body || {};
  if (!employee_code || !full_name) return NextResponse.json({ error: 'missing fields' }, { status: 400 });
  await withInitRetry(() => query(
    `INSERT INTO transport_registrations (employee_code, full_name, employee_type, plant_id, department_id, route_id, pickup_point)
     VALUES (?,?,?,?,?,?,?)`,
    [employee_code, full_name, employee_type, plant_id, department_id, route_id, pickup_point]
  ));
  return NextResponse.json({ ok: true });
}

export async function PUT(request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try { guard(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  const body = await request.json();
  const { id, employee_code, full_name, employee_type=null, plant_id=null, department_id=null, route_id=null, pickup_point=null } = body || {};
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
  await withInitRetry(() => query(
    `UPDATE transport_registrations SET employee_code=?, full_name=?, employee_type=?, plant_id=?, department_id=?, route_id=?, pickup_point=? WHERE id=?`,
    [employee_code, full_name, employee_type, plant_id, department_id, route_id, pickup_point, id]
  ));
  return NextResponse.json({ ok: true });
}

export async function DELETE(request) {
  const user = await getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try { guard(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
  await withInitRetry(() => query('DELETE FROM transport_registrations WHERE id = ?', [id]));
  return NextResponse.json({ ok: true });
}
