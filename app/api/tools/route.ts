import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET() {
  const tools = await sql`SELECT * FROM tools ORDER BY created_at DESC`;
  return NextResponse.json(tools);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, category = "Custom", agent = "Claw", implementation } = body;
  const id = randomUUID();
  const tool = await sql`
    INSERT INTO tools (id, name, description, category, agent, implementation)
    VALUES (${id}, ${name}, ${description}, ${category}, ${agent}, ${implementation})
    RETURNING *
  `;
  return NextResponse.json(tool[0]);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, status, name, description } = body;
  const tool = await sql`
    UPDATE tools SET
      status = COALESCE(${status}, status),
      name = COALESCE(${name}, name),
      description = COALESCE(${description}, description)
    WHERE id = ${id}
    RETURNING *
  `;
  return NextResponse.json(tool[0]);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await sql`DELETE FROM tools WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
