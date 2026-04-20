import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.POSTGRES_URL!);

export default sql;

export async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      agent TEXT NOT NULL DEFAULT 'Claw',
      priority TEXT NOT NULL DEFAULT 'medium',
      status TEXT NOT NULL DEFAULT 'todo',
      tag TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS tools (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT DEFAULT 'Custom',
      agent TEXT DEFAULT 'Claw',
      status TEXT DEFAULT 'draft',
      implementation TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      emoji TEXT DEFAULT '📁',
      status TEXT DEFAULT 'planned',
      progress INTEGER DEFAULT 0,
      tasks_total INTEGER DEFAULT 0,
      tasks_done INTEGER DEFAULT 0,
      milestone TEXT,
      tags TEXT[],
      agents TEXT[],
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS cron_jobs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      schedule TEXT NOT NULL,
      description TEXT,
      agent TEXT DEFAULT 'Claw',
      status TEXT DEFAULT 'scheduled',
      type TEXT DEFAULT 'cron',
      last_run TIMESTAMP,
      next_run TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS memory_entries (
      id TEXT PRIMARY KEY,
      date DATE NOT NULL,
      type TEXT DEFAULT 'notes',
      title TEXT NOT NULL,
      content TEXT,
      tags TEXT[],
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      emoji TEXT DEFAULT '🤖',
      role TEXT,
      description TEXT,
      status TEXT DEFAULT 'draft',
      channel TEXT DEFAULT '—',
      tools_count INTEGER DEFAULT 0,
      tasks_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}
