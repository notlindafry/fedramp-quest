import type { NextRequest } from "next/server";
import { clientIp, cspReportLimit } from "@/lib/redis";
import { bump } from "@/lib/stats";

export const dynamic = "force-dynamic";

// Browsers post CSP violation reports here. We only count them: the report body
// is attacker-controllable, so it is read with a size cap and never stored.
export async function POST(req: NextRequest) {
  try {
    const { success } = await cspReportLimit().limit(clientIp(req));
    if (success) {
      const len = Number(req.headers.get("content-length") ?? "0");
      if (Number.isFinite(len) && len <= 16384) await bump("csp_violation");
    }
  } catch (e) {
    console.error("csp report failed", e instanceof Error ? e.message : "unknown");
  }
  return new Response(null, { status: 204 });
}
