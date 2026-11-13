import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { buildAuthOptions } from "@/lib/auth";
import { authLimit, authSignInLimit, clientIp, tooMany } from "@/lib/redis";

let handler: ReturnType<typeof NextAuth> | null = null;
const getHandler = () => (handler ??= NextAuth(buildAuthOptions()));
type Ctx = { params: Promise<{ nextauth: string[] }> };

async function limited(req: NextRequest): Promise<boolean> {
  const ip = clientIp(req);
  const isSignIn = new URL(req.url).pathname.includes("/signin") && req.method === "POST";
  const { success } = await (isSignIn ? authSignInLimit() : authLimit()).limit(ip);
  return !success;
}

export async function GET(req: NextRequest, ctx: Ctx) {
  if (await limited(req)) return tooMany();
  return getHandler()(req, ctx);
}

export async function POST(req: NextRequest, ctx: Ctx) {
  if (await limited(req)) return tooMany();
  return getHandler()(req, ctx);
}
