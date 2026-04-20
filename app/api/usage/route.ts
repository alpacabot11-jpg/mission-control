import { NextResponse } from "next/server";
import sql from "@/lib/db";

// Track usage locally since Anthropic doesn't expose a public usage API
export async function GET() {
  try {
    // Ensure usage table exists
    await sql`
      CREATE TABLE IF NOT EXISTS usage_log (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        model TEXT NOT NULL,
        input_tokens INTEGER DEFAULT 0,
        output_tokens INTEGER DEFAULT 0,
        cost_usd NUMERIC(10,6) DEFAULT 0,
        session_label TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Get usage by day for current month
    const byDay = await sql`
      SELECT 
        date,
        SUM(input_tokens) as input_tokens,
        SUM(output_tokens) as output_tokens,
        SUM(cost_usd) as cost_usd,
        COUNT(*) as sessions
      FROM usage_log
      WHERE date >= date_trunc('month', CURRENT_DATE)
      GROUP BY date
      ORDER BY date DESC
    `;

    // Get totals
    const totals = await sql`
      SELECT
        SUM(input_tokens) as total_input,
        SUM(output_tokens) as total_output,
        SUM(cost_usd) as total_cost,
        COUNT(*) as total_sessions
      FROM usage_log
      WHERE date >= date_trunc('month', CURRENT_DATE)
    `;

    // Get by model
    const byModel = await sql`
      SELECT
        model,
        SUM(input_tokens) as input_tokens,
        SUM(output_tokens) as output_tokens,
        SUM(cost_usd) as cost_usd
      FROM usage_log
      WHERE date >= date_trunc('month', CURRENT_DATE)
      GROUP BY model
      ORDER BY cost_usd DESC
    `;

    return NextResponse.json({
      byDay,
      totals: totals[0] || { total_input: 0, total_output: 0, total_cost: 0, total_sessions: 0 },
      byModel,
      note: "Usage tracked locally. Sync from console.anthropic.com for official figures.",
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // Manual usage entry
  const body = await req.json();
  const { model, input_tokens, output_tokens, cost_usd, session_label, date } = body;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS usage_log (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        model TEXT NOT NULL,
        input_tokens INTEGER DEFAULT 0,
        output_tokens INTEGER DEFAULT 0,
        cost_usd NUMERIC(10,6) DEFAULT 0,
        session_label TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      INSERT INTO usage_log (date, model, input_tokens, output_tokens, cost_usd, session_label)
      VALUES (
        ${date || new Date().toISOString().split("T")[0]},
        ${model},
        ${input_tokens || 0},
        ${output_tokens || 0},
        ${cost_usd || 0},
        ${session_label || null}
      )
    `;

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
