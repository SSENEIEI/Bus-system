import { NextResponse } from 'next/server';
import { query, initDatabase } from '@/lib/db';
import { getUserFromRequest, requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const rows = await query('SELECT id, code, name FROM plants ORDER BY id');
    return NextResponse.json(rows);
  } catch (e) {
    // If schema missing on first run, initialize and retry once
    const msg = String(e && e.message || '');
    if (/ER_NO_SUCH_TABLE|doesn\'t exist|does not exist/i.test(msg)) {
      try {
        await initDatabase();
        const rows = await query('SELECT id, code, name FROM plants ORDER BY id');
        return NextResponse.json(rows);
      } catch (e2) {
        console.error('Plants GET after init failed:', e2);
        return NextResponse.json({ error: e2.message || 'Internal error' }, { status: 500 });
      }
    }
    console.error('Plants GET failed:', e);
    return NextResponse.json({ error: msg || 'Internal error' }, { status: 500 });
  }
}

export async function POST(request) {
  const user = await getUserFromRequest(request);
  try { requireAdmin(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  try {
    const { code, name } = await request.json();
    const c = (code || '').trim();
    if (!c) return NextResponse.json({ error: 'missing code' }, { status: 400 });
    await query('INSERT INTO plants (code, name) VALUES (?,?)', [c, (name || null)]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}

export async function PUT(request) {
  const user = await getUserFromRequest(request);
  try { requireAdmin(user); } catch (e) { return NextResponse.json({ error: e.message }, { status: e.status || 403 }); }
  try {
    const { id, code, name } = await request.json();
    if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 });
    const updates = [];
    const params = [];
    if (code !== undefined && code !== null && String(code).trim() !== '') { updates.push('code = ?'); params.push(String(code).trim()); }
    if (name !== undefined) { updates.push('name = ?'); params.push(name || null); }
    if (!updates.length) return NextResponse.json({ error: 'no fields to update' }, { status: 400 });
    params.push(id);
    await query(`UPDATE plants SET ${updates.join(', ')} WHERE id = ?`, params);
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
    await query('DELETE FROM plants WHERE id = ?', [id]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'Internal error' }, { status: 500 });
  }
}
