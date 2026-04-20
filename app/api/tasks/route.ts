import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET() {
  const tasks = await sql`SELECT * FROM tasks ORDER BY created_at ASC`;
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, agent = "Claw", priority = "medium", status = "todo", tag } = body;
  const id = randomUUID();
  const task = await sql`
    INSERT INTO tasks (id, title, agent, priority, status, tag)
    VALUES (${id}, ${title}, ${agent}, ${priority}, ${status}, ${tag})
    RETURNING *
  `;
  return NextResponse.json(task[0]);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, status, title, priority, agent, tag } = body;
  const task = await sql`
    UPDATE tasks SET
      status = COALESCE(${status}, status),
      title = COALESCE(${title}, title),
      priority = COALESCE(${priority}, priority),
      agent = COALESCE(${agent}, agent),
      tag = COALESCE(${tag}, tag),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return NextResponse.json(task[0]);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await sql`DELETE FROM tasks WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
