import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { env } from "./env";

let client: Redis | null = null;
export function redis(): Redis {
  if (!client) client = new Redis({ url: env("UPSTASH_REDIS_REST_URL"), token: env("UPSTASH_REDIS_REST_TOKEN") });
  return client;
}

const limiters = new Map<string, Ratelimit>();
function limiter(name: string, tokens: number, window: `${number} s` | `${number} m`): Ratelimit {
  let l = limiters.get(name);
  if (!l) {
    l = new Ratelimit({ redis: redis(), limiter: Ratelimit.slidingWindow(tokens, window), prefix: `fq:rl:${name}` });
    limiters.set(name, l);
  }
  return l;
}

// Auth endpoints: 5 sign-in attempts per minute per IP, 60 other auth calls per minute.
export const authSignInLimit = () => limiter("signin", 5, "1 m");
export const authLimit = () => limiter("auth", 60, "1 m");
// Progress API: generous for play, tight enough to stop abuse.
export const progressReadLimit = () => limiter("progress-read", 60, "1 m");
export const progressWriteLimit = () => limiter("progress-write", 30, "1 m");

// SECURITY TODO: x-forwarded-for is trustworthy here only because Vercel sets it.
// If this app moves to another host, read the client IP from that host's trusted header.
export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  const ip = fwd ? fwd.split(",")[0]?.trim() : req.headers.get("x-real-ip");
  return ip || "unknown";
}

export function tooMany(): Response {
  return Response.json({ error: "Too many requests. Wait a minute and try again." }, { status: 429, headers: { "Retry-After": "60" } });
}
