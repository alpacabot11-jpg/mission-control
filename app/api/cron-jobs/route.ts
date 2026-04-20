import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { randomUUID } from "crypto";

export async function GET() {
  const jobs = await sql`SELECT * FROM cron_jobs ORDER BY created_at ASC`;
  return NextResponse.json(jobs);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, schedule, description, agent = "Claw", type = "cron", next_run } = body;
  const id = randomUUID();
  const job = await sql`
    INSERT INTO cron_jobs (id, name, schedule, description, agent, type, next_run)
    VALUES (${id}, ${name}, ${schedule}, ${description}, ${agent}, ${type}, ${next_run})
    RETURNING *
  `;
  return NextResponse.json(job[0]);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, status } = body;
  const job = await sql`
    UPDATE cron_jobs SET status = ${status} WHERE id = ${id} RETURNING *
  `;
  return NextResponse.json(job[0]);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  await sql`DELETE FROM cron_jobs WHERE id = ${id}`;
  return NextResponse.json({ ok: true });
}
