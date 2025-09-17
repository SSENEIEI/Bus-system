import { NextResponse } from "next/server";
import { initDatabase } from "@/lib/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const seed = searchParams.get('seed') === '1';
    await initDatabase({ seed });
    return NextResponse.json({ message: `Database initialized successfully${seed ? ' with seed' : ''}` });
  } catch (error) {
    console.error("Database initialization error:", error);
    return NextResponse.json(
      { error: "Database initialization failed" },
      { status: 500 }
    );
  }
}
