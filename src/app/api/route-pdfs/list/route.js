import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { list } from "@vercel/blob";

export async function GET() {
  try {
    const isProd = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
    const map = {};
    let lastUpdated = null;

    if (isProd) {
      // List blobs from Vercel Blob storage
      try {
        const resp = await list({ prefix: 'route-pdfs/' });
        const blobs = resp?.blobs || resp?.items || [];
        for (const b of blobs) {
          const pathname = b.pathname || b.key || b.name || b.pathname;
          if (!pathname || !pathname.endsWith('.pdf')) continue;
          const filename = pathname.split('/').pop();
          const key = filename.replace(/\.pdf$/i, '');
          map[key] = b.url || `https://blob.vercel-storage.com/${pathname}`;
          const uploadedAt = b.uploadedAt ? new Date(b.uploadedAt).getTime() : (b.lastModified ? new Date(b.lastModified).getTime() : null);
          if (uploadedAt && (!lastUpdated || uploadedAt > lastUpdated)) lastUpdated = uploadedAt;
        }
      } catch (e) {
        // If listing fails, return empty map
      }
    } else {
      // Local dev: read from public/route-pdfs
      const dir = path.join(process.cwd(), 'public', 'route-pdfs');
      try {
        const files = await fs.readdir(dir);
        for (const f of files) {
          if (!f.toLowerCase().endsWith('.pdf')) continue;
          const key = f.replace(/\.pdf$/i, '');
          map[key] = `/route-pdfs/${f}`;
          try {
            const st = await fs.stat(path.join(dir, f));
            const m = st.mtimeMs || st.mtime?.getTime?.() || null;
            if (m && (!lastUpdated || m > lastUpdated)) lastUpdated = m;
          } catch {}
        }
      } catch {
        // directory may not exist yet
      }
    }

    return NextResponse.json({ map, lastUpdated });
  } catch (err) {
    return NextResponse.json({ error: 'failed to list' }, { status: 500 });
  }
}
