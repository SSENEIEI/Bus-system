import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { put } from "@vercel/blob";

// Ensure this route runs on the Node.js runtime (not Edge)
export const runtime = 'nodejs';
// Optional: give a bit more time for blob uploads on slower networks
export const maxDuration = 60;

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let routeKey = null;
    let column = null;
    let buffer = null;
    if (contentType.includes('multipart/form-data')) {
      // New path: receive raw file via multipart to avoid base64 overhead
      const form = await request.formData();
      routeKey = form.get('routeKey');
      column = form.get('column');
      const file = form.get('file');
      if (file && typeof file.arrayBuffer === 'function') {
        const ab = await file.arrayBuffer();
        buffer = Buffer.from(ab);
      }
    } else if (contentType.includes('application/json')) {
      // Backwards compatibility: JSON base64
      const body = await request.json();
      routeKey = body?.routeKey;
      column = body?.column;
      const base64 = body?.base64;
      if (base64) {
        const cleaned = base64.replace(/^data:application\/pdf;?base64,/, "");
        buffer = Buffer.from(cleaned, "base64");
      }
    }
    if (!routeKey || !column || !buffer) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
    }

    // Enforce a sensible max size (10 MB) to prevent oversized payloads
    const MAX_BYTES = 10 * 1024 * 1024;
    if (buffer.byteLength > MAX_BYTES) {
      return NextResponse.json(
        { error: "ไฟล์ใหญ่เกินไป (เกิน 10 MB)" },
        { status: 413 }
      );
    }

    const isProd = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
  const filename = `${routeKey}-${column}.pdf`;

    if (isProd) {
      // Persist to Vercel Blob in production
      try {
        const blob = await put(`route-pdfs/${filename}`, buffer, {
          access: 'public',
          contentType: 'application/pdf',
          addRandomSuffix: false,
          // If a token is present, the SDK will use it; otherwise Vercel will
          // inject credentials automatically when the project is linked to a Blob store.
          token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        return NextResponse.json({ ok: true, url: blob.url });
      } catch (e) {
        const msg = String(e?.message || e);
        console.error("Vercel Blob put() failed:", msg);
        if (msg.match(/not connected to any Blob stores|No\s+store\s+configured|permission|Unauthorized/i)) {
          return NextResponse.json(
            { error: "โปรเจกต์ยังไม่ได้เชื่อม Blob Store หรือ token ไม่มีสิทธิ์" },
            { status: 500 }
          );
        }
        throw e; // handled by outer catch
      }
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
    const status = err?.status || 500;
    const message =
      err?.message?.includes("BLOB_READ_WRITE_TOKEN")
        ? "เซิร์ฟเวอร์ยังไม่ได้ตั้งค่า BLOB_READ_WRITE_TOKEN"
        : "บันทึกไฟล์ไม่สำเร็จ";
    return NextResponse.json({ error: message }, { status });
  }
}
