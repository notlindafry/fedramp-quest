import type { NextRequest } from "next/server";
import { requireOwner } from "@/lib/guard";
import { progressReadLimit, tooMany } from "@/lib/redis";
import { bump, recentStats } from "@/lib/stats";

export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "no-store" };

// Owner-only: last 14 days of security counters.
export async function GET(req: NextRequest) {
  try {
    const owner = await requireOwner(req);
    if (!owner) { await bump("progress_unauthorized"); return Response.json({ error: "Sign in to see this." }, { status: 401, headers: noStore }); }
    if (!(await progressReadLimit().limit(owner)).success) return tooMany();
    return Response.json({ days: await recentStats(14) }, { headers: noStore });
  } catch (e) {
    console.error("stats GET failed", e);
    return Response.json({ error: "Something went wrong. Try again." }, { status: 500, headers: noStore });
  }
}
