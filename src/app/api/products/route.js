import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "dev-secret";

export async function GET() {
  try {
    const products = await query(
      "SELECT id, name, vendor FROM products ORDER BY name"
    );
    return NextResponse.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

// เพิ่มสินค้า
export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "ไม่พบ token" }, { status: 401 });

    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded.isAdmin)
      return NextResponse.json({ error: "สิทธิ์ไม่เพียงพอ" }, { status: 403 });

    const { name, vendor } = await req.json();
    await query(
      "INSERT INTO products (name, vendor) VALUES (?, ?)",
      [name, vendor]
    );

    return NextResponse.json({ message: "เพิ่มสินค้าเรียบร้อย" });
  } catch (error) {
    console.error("Add product error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

// แก้ไขสินค้า
export async function PUT(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "ไม่พบ token" }, { status: 401 });

    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded.isAdmin)
      return NextResponse.json({ error: "สิทธิ์ไม่เพียงพอ" }, { status: 403 });

    const { id, name, vendor } = await req.json();
    await query(
      "UPDATE products SET name = ?, vendor = ? WHERE id = ?",
      [name, vendor, id]
    );

    return NextResponse.json({ message: "แก้ไขสินค้าเรียบร้อย" });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

// ลบสินค้า
export async function DELETE(req) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "ไม่พบ token" }, { status: 401 });

    const decoded = jwt.verify(token, SECRET_KEY);
    if (!decoded.isAdmin)
      return NextResponse.json({ error: "สิทธิ์ไม่เพียงพอ" }, { status: 403 });

    const { id } = await req.json();
  await query("DELETE FROM products WHERE id = ?", [id]);

    return NextResponse.json({ message: "ลบสินค้าเรียบร้อย" });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
