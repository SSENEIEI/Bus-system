import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// การตั้งค่าการเชื่อมต่อฐานข้อมูล
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "truck_booking_system",
  charset: "utf8mb4",
};

export async function GET(request) {
  let connection;

  try {
    // สร้างการเชื่อมต่อฐานข้อมูล
    connection = await mysql.createConnection(dbConfig);

    // ดึง query parameters
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate") || "2025-08-18";
    const endDate = searchParams.get("endDate") || "2025-08-23";

  // Query สำหรับดึงข้อมูลรถบรรทุก (เพิ่ม booking_date และรองรับ 'เย็น' และแสดง 0 ได้)
  const query = `
      SELECT 
        p.id as product_id,
        p.name as product_name,
        p.vendor,
        at.booking_date,
        at.day_of_week,
        at.time_period,
        at.truck_count as total_trucks
      FROM products p
      LEFT JOIN Around_thetruck at ON p.id = at.product_id
        AND at.booking_date BETWEEN ? AND ?
      WHERE 1=1
      ORDER BY p.name, 
        CASE at.day_of_week
          WHEN 'วันจันทร์' THEN 1
          WHEN 'วันอังคาร' THEN 2
          WHEN 'วันพุธ' THEN 3
          WHEN 'วันพฤหัสบดี' THEN 4
          WHEN 'วันศุกร์' THEN 5
          WHEN 'วันเสาร์' THEN 6
          WHEN 'วันอาทิตย์' THEN 7
          ELSE 8
        END,
        CASE at.time_period
          WHEN 'เช้า' THEN 1
          WHEN 'บ่าย' THEN 2
          WHEN 'เย็น' THEN 3
          ELSE 4
        END
    `;

  const [rows] = await connection.execute(query, [startDate, endDate]);

    // Query สำหรับสถิติรวม (ใช้ข้อมูลจากตาราง products ที่มีอยู่)
  const summaryQuery = `
      SELECT 
        COUNT(DISTINCT p.id) as total_products,
        IFNULL(SUM(at.truck_count), 0) as total_trucks,
        IFNULL(SUM(CASE WHEN at.time_period = 'เช้า' THEN at.truck_count ELSE 0 END), 0) as morning_trucks,
        IFNULL(SUM(CASE WHEN at.time_period = 'บ่าย' THEN at.truck_count ELSE 0 END), 0) as afternoon_trucks,
        IFNULL(SUM(CASE WHEN at.time_period = 'เย็น' THEN at.truck_count ELSE 0 END), 0) as evening_trucks
      FROM products p
      LEFT JOIN Around_thetruck at ON p.id = at.product_id 
        AND at.booking_date BETWEEN ? AND ?
    `; // นับทุก product แม้ยังไม่มีข้อมูลช่วงเวลานั้น

    const [summaryRows] = await connection.execute(summaryQuery, [
      startDate,
      endDate,
      startDate,
      endDate,
    ]);

    return NextResponse.json({
      success: true,
      data: rows,
      summary: summaryRows[0] || {
        total_products: 0,
        total_trucks: 0,
        morning_trucks: 0,
        afternoon_trucks: 0,
        evening_trucks: 0,
      },
      dateRange: {
        startDate,
        endDate,
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function POST(request) {
  let connection;

  try {
    const body = await request.json();
    const { product_id, day_of_week, time_period, truck_count, booking_date } =
      body;

    // Validation
    if (!product_id || !day_of_week || !time_period || !booking_date) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 }
      );
    }

    connection = await mysql.createConnection(dbConfig);

    // ตรวจสอบว่ามีข้อมูลอยู่แล้วหรือไม่
    const checkQuery = `
            SELECT id FROM Around_thetruck 
            WHERE product_id = ? AND day_of_week = ? AND time_period = ? AND booking_date = ?
        `;

    const [existingRows] = await connection.execute(checkQuery, [
      product_id,
      day_of_week,
      time_period,
      booking_date,
    ]);

    if (existingRows.length > 0) {
      // Update existing record
      const updateQuery = `
                UPDATE Around_thetruck 
                SET truck_count = ?, updated_at = CURRENT_TIMESTAMP
                WHERE product_id = ? AND day_of_week = ? AND time_period = ? AND booking_date = ?
            `;

      await connection.execute(updateQuery, [
        truck_count,
        product_id,
        day_of_week,
        time_period,
        booking_date,
      ]);
    } else {
      // Insert new record
      const insertQuery = `
                INSERT INTO Around_thetruck (product_id, day_of_week, time_period, truck_count, booking_date)
                VALUES (?, ?, ?, ?, ?)
            `;

      await connection.execute(insertQuery, [
        product_id,
        day_of_week,
        time_period,
        truck_count,
        booking_date,
      ]);
    }

    return NextResponse.json({
      success: true,
      message: "Data saved successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
        message: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
