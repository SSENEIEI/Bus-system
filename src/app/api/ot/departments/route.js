import { NextResponse } from 'next/server';
import { query, initDatabase } from '@/lib/db';
import { getUserFromRequest, requireAdmin } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const plantId = searchParams.get('plantId');
    const sql = plantId
      ? `SELECT d.id, d.plant_id, p.code as plant_code, d.code, d.name
         FROM departments d JOIN plants p ON p.id = d.plant_id
         WHERE d.plant_id = ?
         ORDER BY d.plant_id ASC, d.created_at ASC, d.id ASC`
      : `SELECT d.id, d.plant_id, p.code as plant_code, d.code, d.name
         FROM departments d JOIN plants p ON p.id = d.plant_id
         ORDER BY d.plant_id ASC, d.created_at ASC, d.id ASC`;
    const rows = await query(sql, plantId ? [plantId] : []);
    return NextResponse.json(rows);
  } catch (e) {
    const msg = String(e && e.message || '');
    if (/ER_NO_SUCH_TABLE|doesn\'t exist|does not exist/i.test(msg)) {
      try {
        await initDatabase();
        const { searchParams } = new URL(request.url);
        const plantId = searchParams.get('plantId');
        const sql = plantId
          ? `SELECT d.id, d.plant_id, p.code as plant_code, d.code, d.name
             FROM departments d JOIN plants p ON p.id = d.plant_id
             WHERE d.plant_id = ?
             ORDER BY d.plant_id ASC, d.created_at ASC, d.id ASC`
          : `SELECT d.id, d.plant_id, p.code as plant_code, d.code, d.name
             FROM departments d JOIN plants p ON p.id = d.plant_id
             ORDER BY d.plant_id ASC, d.created_at ASC, d.id ASC`;
        const rows = await query(sql, plantId ? [plantId] : []);
        return NextResponse.json(rows);
      } catch (e2) {
        console.error('Departments GET after init failed:', e2);
        return NextResponse.json({ error: e2.message || 'Internal error' }, { status: 500 });
      }
    }
    console.error('Departments GET failed:', e);
    return NextResponse.json({ error: msg || 'Internal error' }, { status: 500 });
  }
}

export async function POST(request) {
  const user = await getUserFromRequest(request);
  try { requireAdmin(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  try {
    const { plant_id, code, name } = await request.json();
    if (!plant_id || (!code && !name)) return NextResponse.json({ error: 'missing plant_id and name/code' }, { status: 400 });
    const finalCode = (code && code.trim()) ? code.trim() : (name && name.trim() ? name.trim().toUpperCase() : null);
    if (!finalCode) return NextResponse.json({ error: 'code cannot be null' }, { status: 400 });
    await query('INSERT INTO departments (plant_id, code, name) VALUES (?,?,?)', [plant_id, finalCode, name || null]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}

export async function PUT(request) {
  const user = await getUserFromRequest(request);
  try { requireAdmin(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  try {
    const { id, plant_id, code, name } = await request.json();
    if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
    const updates = [];
    const params = [];
    if (plant_id) { updates.push('plant_id = ?'); params.push(plant_id); }
    if (code !== undefined || name !== undefined) {
      // If code provided explicitly, use it; else derive from name if provided
      if (code !== undefined && code !== null && String(code).trim() !== '') {
        updates.push('code = ?'); params.push(String(code).trim());
      } else if (name !== undefined && name !== null && String(name).trim() !== '') {
        updates.push('code = ?'); params.push(String(name).trim().toUpperCase());
      } else {
        // Do not allow setting code to NULL because DB requires NOT NULL
      }
    }
    if (name !== undefined) { updates.push('name = ?'); params.push(name || null); }
    if (!updates.length) return NextResponse.json({ error: 'no fields to update' }, { status: 400 });
    params.push(id);
    await query(`UPDATE departments SET ${updates.join(', ')} WHERE id = ?`, params);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const user = await getUserFromRequest(request);
  try { requireAdmin(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
    await query('DELETE FROM departments WHERE id = ?', [id]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}
