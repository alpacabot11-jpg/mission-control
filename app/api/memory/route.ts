import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET() {
  const entries = await sql`SELECT * FROM memory_entries ORDER BY date DESC, created_at ASC`;
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { date, type = "notes", title, content, tags = [] } = body;
  const id = randomUUID();
  const entry = await sql`
    INSERT INTO memory_entries (id, date, type, title, content, tags)
    VALUES (${id}, ${date}, ${type}, ${title}, ${content}, ${tags})
    RETURNING *
  `;
  return NextResponse.json(entry[0]);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await sql`DELETE FROM memory_entries WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
