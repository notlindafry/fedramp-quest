import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { env, ownerEmail } from "./env";
import { currentSessionEpoch } from "./auth";

// Server-side authorization for every progress call. Never trusts the client:
// the signed token must be the owner's, unexpired, and not revoked by a sign-out.
export async function requireOwner(req: NextRequest): Promise<string | null> {
  const token = await getToken({ req, secret: env("NEXTAUTH_SECRET") });
  if (!token || token.role !== "owner" || typeof token.email !== "string") return null;
  if (token.email !== ownerEmail()) return null;
  const epoch = await currentSessionEpoch(token.email);
  if (typeof token.ver !== "string" || token.ver !== epoch) return null;
  return token.email;
}

// Blocks cross-site writes: state-changing calls must come from this site.
export function sameOrigin(req: NextRequest): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try { return new URL(origin).origin === new URL(env("NEXTAUTH_URL")).origin; } catch { return false; }
}
