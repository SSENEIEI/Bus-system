import { NextResponse } from "next/server";
import { query, initDatabase } from "@/lib/db";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

// GET /api/locations -> list locations
export async function GET() {
  try {
    const rows = await query("SELECT id, name FROM locations ORDER BY name");
    return NextResponse.json(rows);
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') {
      try {
        // Self-heal: create schema (idempotent)
        await initDatabase();
        await query(`CREATE TABLE IF NOT EXISTS locations (\n         id INT PRIMARY KEY AUTO_INCREMENT,\n         name VARCHAR(100) NOT NULL UNIQUE,\n         created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP\n       ) CHARSET=utf8mb4`);
        // Optional seed
        await query(`INSERT INTO locations (name) VALUES ('AC'),('RF'),('EMR'),('treasuryOUT') ON DUPLICATE KEY UPDATE name=VALUES(name)`);
        const rows2 = await query("SELECT id, name FROM locations ORDER BY name");
        return NextResponse.json(rows2);
      } catch (inner) {
        console.error('Auto-create locations failed:', inner);
      }
    }
    console.error("Get locations error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

// POST /api/locations -> add (admin only)
export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "ไม่พบ token" }, { status: 401 });
    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded.isAdmin) return NextResponse.json({ error: "สิทธิ์ไม่เพียงพอ" }, { status: 403 });

    const { name } = await req.json();
    if (!name || !name.trim()) return NextResponse.json({ error: "name ต้องไม่ว่าง" }, { status: 400 });

    try {
      await query("INSERT INTO locations (name) VALUES (?)", [name.trim()]);
    } catch (err) {
      if (err.code === 'ER_NO_SUCH_TABLE') {
        // Attempt self-heal then retry once
        await initDatabase();
        await query(`CREATE TABLE IF NOT EXISTS locations (\n         id INT PRIMARY KEY AUTO_INCREMENT,\n         name VARCHAR(100) NOT NULL UNIQUE,\n         created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP\n       ) CHARSET=utf8mb4`);
        await query("INSERT INTO locations (name) VALUES (?)", [name.trim()]);
      } else throw err;
    }
    return NextResponse.json({ message: "เพิ่ม location สำเร็จ" });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: "มี location นี้แล้ว" }, { status: 409 });
    }
    console.error("Add location error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

// DELETE /api/locations -> delete by id (admin only)
export async function DELETE(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "ไม่พบ token" }, { status: 401 });
    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded.isAdmin) return NextResponse.json({ error: "สิทธิ์ไม่เพียงพอ" }, { status: 403 });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "ต้องมี id" }, { status: 400 });

    try {
      await query("DELETE FROM locations WHERE id = ?", [id]);
    } catch (err) {
      if (err.code === 'ER_NO_SUCH_TABLE') {
        await initDatabase();
        return NextResponse.json({ error: "ตาราง locations ยังไม่ถูกสร้าง" }, { status: 500 });
      }
      throw err;
    }
    return NextResponse.json({ message: "ลบ location สำเร็จ" });
  } catch (err) {
    console.error("Delete location error:", err);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
