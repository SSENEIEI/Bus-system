import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export async function DELETE(req, context) {
  try {
    // await params ก่อน destructuring
    const { params } = context;
    const { id: bookingId } = await params;

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token)
      return NextResponse.json({ error: "ไม่พบ token" }, { status: 401 });

    const decoded = jwt.verify(token, SECRET_KEY);

  // ตรวจสอบว่า booking เป็นของผู้ใช้คนนี้ หรือ admin
  const rows = await query("SELECT user_id FROM bookings WHERE id = ?", [bookingId]);

  if (rows.length === 0) {
      return NextResponse.json({ error: "ไม่พบรายการจอง" }, { status: 404 });
    }

  if (rows[0].user_id !== decoded.userId && !decoded.isAdmin) {
      return NextResponse.json(
        { error: "ไม่สามารถลบ booking ของคนอื่นได้" },
        { status: 403 }
      );
    }
  await query("DELETE FROM bookings WHERE id = ?", [bookingId]);

    return NextResponse.json({ message: "ลบ booking สำเร็จ" });
  } catch (error) {
    console.error("Delete booking error:", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
