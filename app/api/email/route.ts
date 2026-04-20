import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { readFile, readdir } from "fs/promises";

const execAsync = promisify(exec);
const CONTROL = "/Users/openclawbot/.openclaw/workspace/email-agent/email_control.sh";
const LOGFILE = "/Users/openclawbot/.openclaw/workspace/email-agent/email.log";
const STATE_FILE = "/Users/openclawbot/.openclaw/workspace/email-agent/state.json";
const DRAFTS_DIR = "/Users/openclawbot/.openclaw/workspace/email-agent/drafts";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") || "status";

  try {
    if (action === "status") {
      const { stdout } = await execAsync(`bash ${CONTROL} status`);
      const raw = stdout.trim();
      const running = raw.startsWith("running");
      const pid = running ? raw.split(":")[1] : null;

      let state = {};
      try {
        const s = await readFile(STATE_FILE, "utf-8");
        state = JSON.parse(s);
      } catch {}

      return NextResponse.json({ running, pid, ...state });
    }

    if (action === "logs") {
      try {
        const log = await readFile(LOGFILE, "utf-8");
        const lines = log.split("\n").filter(Boolean).slice(-100);
        return NextResponse.json({ lines });
      } catch {
        return NextResponse.json({ lines: [] });
      }
    }

    if (action === "drafts") {
      try {
        const files = await readdir(DRAFTS_DIR);
        const drafts = await Promise.all(
          files.slice(-10).map(async (f) => {
            const content = await readFile(`${DRAFTS_DIR}/${f}`, "utf-8");
            return { filename: f, content };
          })
        );
        return NextResponse.json({ drafts: drafts.reverse() });
      } catch {
        return NextResponse.json({ drafts: [] });
      }
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { action } = await req.json();
  if (!["start", "stop", "restart"].includes(action)) {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
  try {
    const { stdout, stderr } = await execAsync(`bash ${CONTROL} ${action}`);
    return NextResponse.json({ ok: true, message: stdout.trim() || stderr.trim() });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
