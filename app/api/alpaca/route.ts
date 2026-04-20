import { NextRequest, NextResponse } from "next/server";

const ALPACA_KEY = "PKEUJGK5F7GRK3GZNWC7EZDUSI";
const ALPACA_SECRET = "4rWrDTiyX84xJSA3oJkBAYMUTKgRgqF2XYf87z1cB5jP";
const BASE = "https://paper-api.alpaca.markets/v2";
const DATA_BASE = "https://data.alpaca.markets/v2";

const headers = {
  "APCA-API-KEY-ID": ALPACA_KEY,
  "APCA-API-SECRET-KEY": ALPACA_SECRET,
  "Content-Type": "application/json",
};

async function alpacaFetch(url: string) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`Alpaca API error: ${res.status} ${await res.text()}`);
  return res.json();
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") || "all";

  try {
    if (action === "account") {
      const account = await alpacaFetch(`${BASE}/account`);
      return NextResponse.json(account);
    }

    if (action === "positions") {
      const positions = await alpacaFetch(`${BASE}/positions`);
      return NextResponse.json(positions);
    }

    if (action === "orders") {
      const orders = await alpacaFetch(`${BASE}/orders?status=all&limit=20&direction=desc`);
      return NextResponse.json(orders);
    }

    if (action === "activities") {
      const activities = await alpacaFetch(`${BASE}/account/activities?activity_types=FILL&page_size=20`);
      return NextResponse.json(activities);
    }

    if (action === "clock") {
      const clock = await alpacaFetch(`${BASE}/clock`);
      return NextResponse.json(clock);
    }

    // Default: fetch everything in parallel
    const [account, positions, orders, clock] = await Promise.all([
      alpacaFetch(`${BASE}/account`),
      alpacaFetch(`${BASE}/positions`),
      alpacaFetch(`${BASE}/orders?status=all&limit=10&direction=desc`),
      alpacaFetch(`${BASE}/clock`),
    ]);

    return NextResponse.json({ account, positions, orders, clock });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
