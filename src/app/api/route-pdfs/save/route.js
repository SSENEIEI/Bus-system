import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";

export async function POST(request) {
  try {
    const { routeKey, column, base64 } = await request.json();
    if (!routeKey || !column || !base64) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
    }

    // Only allow pdf
    const cleaned = base64.replace(/^data:application\/pdf;?base64,/, "");
    const buffer = Buffer.from(cleaned, "base64");

    const isProd = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
    const filename = `${routeKey}-${column}.pdf`;

    if (isProd) {
      // Persist to Vercel Blob in production
      const blob = await put(`route-pdfs/${filename}`, buffer, {
        access: 'public',
        contentType: 'application/pdf',
        addRandomSuffix: false,
      });
      return NextResponse.json({ ok: true, url: blob.url });
    } else {
      // Local dev: write to public folder
      const dir = path.join(process.cwd(), "public", "route-pdfs");
      await fs.mkdir(dir, { recursive: true });
      const filepath = path.join(dir, filename);
      await fs.writeFile(filepath, buffer);
      const url = `/route-pdfs/${filename}`;
      return NextResponse.json({ ok: true, url });
    }
  } catch (err) {
    console.error("Save route PDF error:", err);
    return NextResponse.json({ error: "บันทึกไฟล์ไม่สำเร็จ" }, { status: 500 });
  }
}
