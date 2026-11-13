import { redis } from "./redis";

// Daily security counters for the owner-only stats panel. Counts only:
// no IPs, emails, request bodies or other attacker-supplied content are stored.
export const STAT_EVENTS = [
  "signin_denied",
  "auth_rate_limited",
  "origin_blocked",
  "progress_unauthorized",
  "progress_rate_limited",
  "csp_violation",
] as const;
export type StatEvent = (typeof STAT_EVENTS)[number];

const RETAIN_SECONDS = 60 * 60 * 24 * 35;
const dayKey = (d: Date) => `fq:stat:${d.toISOString().slice(0, 10)}`;

// Per-instance cap so a flood of junk requests can't turn into a flood of Redis
// commands (and an Upstash bill). Under attack the panel undercounts, which is fine:
// it only needs to show that something is happening.
const MAX_PER_MINUTE = 30;
const windows = new Map<StatEvent, { start: number; n: number }>();
function allow(ev: StatEvent): boolean {
  const now = Date.now();
  const w = windows.get(ev);
  if (!w || now - w.start >= 60_000) { windows.set(ev, { start: now, n: 1 }); return true; }
  if (w.n >= MAX_PER_MINUTE) return false;
  w.n += 1;
  return true;
}

// Best effort: a counter failure must never block the request it describes.
export async function bump(ev: StatEvent): Promise<void> {
  if (!allow(ev)) return;
  try {
    const key = dayKey(new Date());
    const p = redis().pipeline();
    p.hincrby(key, ev, 1);
    p.expire(key, RETAIN_SECONDS);
    await p.exec();
  } catch (e) {
    console.error("stat bump failed", e instanceof Error ? e.message : "unknown");
  }
}

export async function recentStats(days = 14) {
  const out: { date: string; counts: Record<StatEvent, number> }[] = [];
  const now = Date.now();
  const p = redis().pipeline();
  const dates: string[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(now - i * 864e5);
    dates.push(d.toISOString().slice(0, 10));
    p.hgetall(dayKey(d));
  }
  const rows = (await p.exec()) as (Record<string, unknown> | null)[];
  rows.forEach((row, i) => {
    const counts = Object.fromEntries(STAT_EVENTS.map(ev => {
      const n = Number(row?.[ev] ?? 0);
      return [ev, Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0];
    })) as Record<StatEvent, number>;
    out.push({ date: dates[i] as string, counts });
  });
  return out;
}
