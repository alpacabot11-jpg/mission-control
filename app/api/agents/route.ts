import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET() {
  const agents = await sql`SELECT * FROM agents ORDER BY created_at ASC`;
  return NextResponse.json(agents);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, emoji = "🤖", role, description, status = "draft", channel = "—" } = body;
  const id = randomUUID();
  const agent = await sql`
    INSERT INTO agents (id, name, emoji, role, description, status, channel)
    VALUES (${id}, ${name}, ${emoji}, ${role}, ${description}, ${status}, ${channel})
    RETURNING *
  `;
  return NextResponse.json(agent[0]);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, status, channel } = body;
  const agent = await sql`
    UPDATE agents SET
      status = COALESCE(${status}, status),
      channel = COALESCE(${channel}, channel)
    WHERE id = ${id}
    RETURNING *
  `;
  return NextResponse.json(agent[0]);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await sql`DELETE FROM agents WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
