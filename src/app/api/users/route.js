import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const SECRET_KEY = process.env.JWT_SECRET;
if (!SECRET_KEY) {
  throw new Error("Missing JWT_SECRET env var");
}

// Helper: verify admin from Authorization header
async function requireAdmin(req) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) throw new Error("NO_TOKEN");
  const decoded = jwt.verify(token, SECRET_KEY);
  if (!decoded.isAdmin && decoded.username !== 'adminscrap') throw new Error("NOT_ADMIN");
  return decoded;
}

// GET /api/users -> list users (admin only)
export async function GET(req) {
  try {
    await requireAdmin(req);
    const rows = await query("SELECT id, username, department, plant_id, department_id, is_admin, is_super_admin, created_at FROM users ORDER BY id ASC");
    let ud = [];
    try { ud = await query('SELECT user_id, department_id FROM user_departments'); } catch { ud = []; }
    const map = new Map();
    for (const r of ud) {
      if (!map.has(r.user_id)) map.set(r.user_id, []);
      map.get(r.user_id).push(r.department_id);
    }
    const withDeptIds = rows.map(u => ({ ...u, department_ids: map.get(u.id) || (u.department_id ? [u.department_id] : []) }));
    return NextResponse.json(withDeptIds);
  } catch (err) {
    if (err.message === 'NO_TOKEN') return NextResponse.json({ error: 'ไม่พบ token' }, { status: 401 });
    if (err.message === 'NOT_ADMIN') return NextResponse.json({ error: 'สิทธิ์ไม่เพียงพอ' }, { status: 403 });
    console.error('List users error:', err);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

// POST /api/users -> create user (admin only)
export async function POST(req) {
  try {
    await requireAdmin(req);
    const { username, password, plant_id = null, department_id = null, department_ids = null, display_name = null, is_admin = 0, is_super_admin = 0 } = await req.json();
    if (!username || !password) return NextResponse.json({ error: 'ต้องมี username/password' }, { status: 400 });
    const hashed = await bcrypt.hash(password.trim(), 10);
    await query(
      `INSERT INTO users (username, password, display_name, plant_id, department_id, is_admin, is_super_admin)
       VALUES (?,?,?,?,?,?,?)`,
      [username.trim(), hashed, display_name, plant_id, department_id, is_admin ? 1 : 0, is_super_admin ? 1 : 0]
    );
    // sync department_ids
    try {
      const u = await query('SELECT id FROM users WHERE username = ?', [username.trim()]);
      const userId = u[0]?.id;
      if (userId && Array.isArray(department_ids)) {
        await query('DELETE FROM user_departments WHERE user_id = ?', [userId]);
        for (const did of department_ids) {
          if (did != null) await query('INSERT IGNORE INTO user_departments (user_id, department_id) VALUES (?,?)', [userId, did]);
        }
      }
    } catch (e) { console.error('POST user_departments sync failed:', e.message); }
    return NextResponse.json({ message: 'สร้างผู้ใช้สำเร็จ' }, { status: 201 });
  } catch (err) {
    if (err.message === 'NO_TOKEN') return NextResponse.json({ error: 'ไม่พบ token' }, { status: 401 });
    if (err.message === 'NOT_ADMIN') return NextResponse.json({ error: 'สิทธิ์ไม่เพียงพอ' }, { status: 403 });
    if (err.code === 'ER_DUP_ENTRY') return NextResponse.json({ error: 'ชื่อนี้ถูกใช้แล้ว' }, { status: 400 });
    console.error('Create user error:', err);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

// PUT /api/users -> update user (password and/or department) admin only
export async function PUT(req) {
  try {
    await requireAdmin(req);
  const body = await req.json();
  const { id, password, department, plant_id, department_id, department_ids, display_name, is_admin, is_super_admin } = body;
    if (!id) return NextResponse.json({ error: 'ต้องมี id' }, { status: 400 });

    const updates = [];
    const params = [];

    if (password && password.trim()) {
      const hashed = await bcrypt.hash(password.trim(), 10);
      updates.push('password = ?');
      params.push(hashed);
    }
    if (department && department.trim()) { updates.push('department = ?'); params.push(department.trim()); }
    if (display_name !== undefined) { updates.push('display_name = ?'); params.push(display_name || null); }
    if (plant_id !== undefined) { updates.push('plant_id = ?'); params.push(plant_id || null); }
    if (department_id !== undefined) { updates.push('department_id = ?'); params.push(department_id || null); }
    if (is_admin !== undefined) { updates.push('is_admin = ?'); params.push(is_admin ? 1 : 0); }
    if (is_super_admin !== undefined) { updates.push('is_super_admin = ?'); params.push(is_super_admin ? 1 : 0); }
    if (!updates.length) return NextResponse.json({ error: 'ไม่มีข้อมูลที่จะอัปเดต' }, { status: 400 });

    params.push(id);
    await query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);
    // sync department_ids if provided
    if (Array.isArray(department_ids)) {
      try {
        await query('DELETE FROM user_departments WHERE user_id = ?', [id]);
        for (const did of department_ids) {
          if (did != null) await query('INSERT IGNORE INTO user_departments (user_id, department_id) VALUES (?,?)', [id, did]);
        }
      } catch (e) { console.error('PUT user_departments sync failed:', e.message); }
    }
    return NextResponse.json({ message: 'อัปเดตผู้ใช้สำเร็จ' });
  } catch (err) {
    if (err.message === 'NO_TOKEN') return NextResponse.json({ error: 'ไม่พบ token' }, { status: 401 });
    if (err.message === 'NOT_ADMIN') return NextResponse.json({ error: 'สิทธิ์ไม่เพียงพอ' }, { status: 403 });
    console.error('Update user error:', err);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}

// DELETE /api/users -> delete user (admin only)
export async function DELETE(req) {
  try {
    await requireAdmin(req);
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'ต้องมี id' }, { status: 400 });

    // Prevent deleting adminscrap
    const rows = await query('SELECT username FROM users WHERE id = ?', [id]);
    if (!rows.length) return NextResponse.json({ error: 'ไม่พบผู้ใช้' }, { status: 404 });
    if (rows[0].username === 'adminscrap' || rows[0].username === 'adminga') {
      return NextResponse.json({ error: 'ห้ามลบ adminscrap' }, { status: 400 });
    }

    await query('DELETE FROM users WHERE id = ?', [id]);
    return NextResponse.json({ message: 'ลบผู้ใช้สำเร็จ' });
  } catch (err) {
    if (err.message === 'NO_TOKEN') return NextResponse.json({ error: 'ไม่พบ token' }, { status: 401 });
    if (err.message === 'NOT_ADMIN') return NextResponse.json({ error: 'สิทธิ์ไม่เพียงพอ' }, { status: 403 });
    console.error('Delete user error:', err);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 });
  }
}
