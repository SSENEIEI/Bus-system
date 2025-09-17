import { NextResponse } from "next/server";
import { generateUploadUrl } from "@vercel/blob";

export async function POST(request) {
  try {
    const { routeKey, column, contentType } = await request.json();
    if (!routeKey || !column) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบ" }, { status: 400 });
    }

    // Only allow PDF uploads
    const ct = (contentType || "application/pdf").toLowerCase();
    if (!ct.includes("pdf")) {
      return NextResponse.json({ error: "ชนิดไฟล์ไม่ถูกต้อง (ต้องเป็น PDF)" }, { status: 400 });
    }

    const isProd = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
    const filename = `${routeKey}-${column}.pdf`;
    const pathname = `route-pdfs/${filename}`;

    if (!isProd) {
      // In local dev we keep using the existing server upload to local filesystem
      return NextResponse.json({ unsupported: true }, { status: 200 });
    }

    const { url, token } = await generateUploadUrl({
      pathname,
      access: "public",
      addRandomSuffix: false,
      contentType: "application/pdf",
    });

    return NextResponse.json({ url, token, pathname });
  } catch (err) {
    console.error("Upload URL error:", err);
    return NextResponse.json({ error: "ไม่สามารถสร้าง URL สำหรับอัปโหลดได้" }, { status: 500 });
  }
}
