//src\app\api\bookings\route.js
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "dev-secret";

export async function GET(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    // token เป็น optional: ถ้ามีให้ verify, ถ้าไม่มีถือว่า public read-only
    if (token) {
      try { jwt.verify(token, SECRET_KEY); } catch (e) { return NextResponse.json({ error: "token ไม่ถูกต้อง" }, { status: 401 }); }
    }

    const { searchParams } = new URL(request.url);
    const date =
      searchParams.get("date") || new Date().toISOString().split("T")[0];

    const bookings = await query(
      `SELECT 
        b.id,
        b.truck_number,
        b.department,
        b.percentage,
        b.booking_date,
        b.product_id,
        p.name as product_name,
        p.vendor,
        u.username
      FROM bookings b
      JOIN products p ON b.product_id = p.id
      JOIN users u ON b.user_id = u.id
      WHERE b.booking_date = ?
      ORDER BY b.truck_number, b.department`,
      [date]
    );
  // หากเป็น public (ไม่มี token) สามารถคืนข้อมูลได้เหมือนเดิม (ถ้าต้องการลดข้อมูลอาจกรองฟิลด์ได้ภายหลัง)
  return NextResponse.json(bookings);
  } catch (error) {
    console.error("Get bookings error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "ไม่พบ token" }, { status: 401 });

    const decoded = jwt.verify(token, SECRET_KEY);
    const { productId, truckNumber, department, percentage, bookingDate } =
      await request.json();

    // จำกัดเฉพาะแผนกตัวเอง ยกเว้น admin
    const isAdminUser = decoded.isAdmin || decoded.username === 'adminscrap';
    if (!isAdminUser && department !== decoded.department) {
      return NextResponse.json(
        { error: `คุณไม่สามารถจองแผนก ${department} ได้` },
        { status: 403 }
      );
    }

    await query(
      `INSERT INTO bookings (user_id, product_id, truck_number, department, percentage, booking_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [decoded.userId, productId, truckNumber, department, percentage, bookingDate]
    );
    return NextResponse.json({ message: "จองสำเร็จ" });
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
