import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET() {
  const projects = await sql`SELECT * FROM projects ORDER BY created_at ASC`;
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, description, emoji = "📁", status = "planned", milestone, tags = [], agents = [] } = body;
  const id = randomUUID();
  const project = await sql`
    INSERT INTO projects (id, name, description, emoji, status, milestone, tags, agents)
    VALUES (${id}, ${name}, ${description}, ${emoji}, ${status}, ${milestone}, ${tags}, ${agents})
    RETURNING *
  `;
  return NextResponse.json(project[0]);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, status, progress, tasks_done } = body;
  const project = await sql`
    UPDATE projects SET
      status = COALESCE(${status}, status),
      progress = COALESCE(${progress}, progress),
      tasks_done = COALESCE(${tasks_done}, tasks_done)
    WHERE id = ${id}
    RETURNING *
  `;
  return NextResponse.json(project[0]);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await sql`DELETE FROM projects WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
