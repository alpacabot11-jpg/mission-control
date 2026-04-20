import { NextResponse } from "next/server";
import { initDB } from "@/lib/db";
import sql from "@/lib/db";

export async function POST() {
  try {
    await initDB();

    // Seed default data if empty
    const existingAgents = await sql`SELECT id FROM agents LIMIT 1`;
    if (existingAgents.length === 0) {
      await sql`
        INSERT INTO agents (id, name, emoji, role, description, status, channel) VALUES
        ('claw', 'Claw', '🦞', 'Orchestrator / Main', 'Primary interface, fleet coordination, task routing.', 'active', 'Telegram'),
        ('trader', 'Trader', '📈', 'Stock Trading Agent', 'Market data, trade execution (approval required), portfolio tracking.', 'draft', '—'),
        ('email', 'Email', '📧', 'Email Agent', 'Inbox triage, summarization, draft replies. Never sends without approval.', 'draft', '—'),
        ('observer', 'Observer', '👁', 'Fleet Observer', 'Health monitoring, heartbeat aggregation, alert routing.', 'draft', '—')
      `;

      await sql`
        INSERT INTO tasks (id, title, agent, priority, status, tag) VALUES
        ('t1', 'Build Trader agent', 'Claw', 'high', 'todo', 'Fleet'),
        ('t2', 'Build Email agent', 'Claw', 'high', 'todo', 'Fleet'),
        ('t3', 'Set up Observer agent', 'Claw', 'medium', 'todo', 'Fleet'),
        ('t4', 'Configure Discord comms layer', 'Claw', 'medium', 'todo', 'Comms'),
        ('t5', 'Define trading strategy guardrails', 'Trader', 'low', 'todo', 'Trading'),
        ('t6', 'Mission Control dashboard', 'Claw', 'high', 'in-progress', 'Dev'),
        ('t7', 'Core setup (IDENTITY, USER, SOUL, MEMORY)', 'Claw', 'high', 'done', 'Setup'),
        ('t8', 'Mission, Playbook, Boundaries, Fleet, Comms', 'Claw', 'high', 'done', 'Setup')
      `;

      await sql`
        INSERT INTO cron_jobs (id, name, schedule, description, agent, status, type, next_run) VALUES
        ('j1', 'Heartbeat Poll', 'Every 30 min', 'Check inbox, calendar, notifications.', 'Claw', 'active', 'heartbeat', '~28 min'),
        ('j2', 'Market Open Brief', 'Mon–Fri 9:30 AM EST', 'Fetch pre-market movers, watchlist updates.', 'Trader', 'scheduled', 'cron', 'Tomorrow 9:30 AM'),
        ('j3', 'Email Summary', 'Daily 8:00 AM EST', 'Summarize unread emails, flag urgent items.', 'Email', 'scheduled', 'cron', 'Tomorrow 8:00 AM'),
        ('j4', 'Fleet Health Check', 'Every 6 hours', 'Ping all agents, verify uptime.', 'Observer', 'scheduled', 'cron', '~6 hours'),
        ('j5', 'Memory Consolidation', 'Sunday 11:00 PM EST', 'Review weekly notes, update MEMORY.md.', 'Claw', 'scheduled', 'cron', 'Next Sunday')
      `;

      await sql`
        INSERT INTO projects (id, name, description, emoji, status, progress, tasks_total, tasks_done, milestone, tags, agents) VALUES
        ('p1', 'Fleet Build-Out', 'Spin up and configure all planned agents.', '🚀', 'active', 20, 8, 2, 'All 4 agents online', ARRAY['Infrastructure', 'High Priority'], ARRAY['Claw']),
        ('p2', 'Trading System', 'Build a stock trading agent with real-time data feeds.', '📈', 'planned', 0, 12, 0, 'First approved trade executed', ARRAY['Trading', 'Finance'], ARRAY['Trader']),
        ('p3', 'Email Ops', 'Automate email triage, summarization, draft replies.', '📧', 'planned', 0, 6, 0, 'Inbox at zero every morning', ARRAY['Comms'], ARRAY['Email']),
        ('p4', 'Mission Control', 'Build and iterate on the dashboard.', '🖥', 'active', 80, 10, 8, 'Fully interactive dashboard', ARRAY['Dev', 'UI'], ARRAY['Claw'])
      `;

      await sql`
        INSERT INTO memory_entries (id, date, type, title, content, tags) VALUES
        ('m1', '2026-04-19', 'identity', 'Claw came online', 'Name: Claw 🦞. Main agent for Tommy (Boss). Orchestrator role — direct comms + fleet coordination.', ARRAY['Identity', 'Setup']),
        ('m2', '2026-04-19', 'user', 'About Boss', 'Tommy Cedrone. EST timezone. Primary channel: Telegram. Building a multi-agent fleet. Communication style: direct, no fluff.', ARRAY['User']),
        ('m3', '2026-04-19', 'decision', 'Fleet architecture decided', 'Inspired by @adspendan''s 20-agent blueprint. Specialized agents per domain running autonomously.', ARRAY['Fleet', 'Architecture']),
        ('m4', '2026-04-19', 'lesson', 'Communication preference', 'Boss doesn''t want hand-holding. Lead with the answer. He thinks in systems.', ARRAY['Comms', 'Preference']),
        ('m5', '2026-04-19', 'build', 'Mission Control built', 'Next.js dashboard live on Vercel. All 10 pages functional with Neon Postgres backend.', ARRAY['Dev', 'Dashboard'])
      `;
    }

    return NextResponse.json({ ok: true, message: "DB initialized and seeded" });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
