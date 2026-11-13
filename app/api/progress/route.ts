import type { NextRequest } from "next/server";
import { ProgressSchema, MAX_BODY_BYTES } from "@/lib/progress";
import { requireOwner, sameOrigin } from "@/lib/guard";
import { redis, progressReadLimit, progressWriteLimit, tooMany } from "@/lib/redis";
import { bump } from "@/lib/stats";

export const dynamic = "force-dynamic";
const key = (email: string) => `fq:progress:${email}`;
const noStore = { "Cache-Control": "no-store" };
const generic = () => Response.json({ error: "Something went wrong. Try again." }, { status: 500, headers: noStore });
const unauth = async () => { await bump("progress_unauthorized"); return Response.json({ error: "Sign in to save progress." }, { status: 401, headers: noStore }); };

export async function GET(req: NextRequest) {
  try {
    const owner = await requireOwner(req);
    if (!owner) return await unauth();
    if (!(await progressReadLimit().limit(owner)).success) { await bump("progress_rate_limited"); return tooMany(); }
    const raw = await redis().get<unknown>(key(owner));
    const parsed = ProgressSchema.safeParse(raw);
    return Response.json({ progress: parsed.success ? parsed.data : null }, { headers: noStore });
  } catch (e) {
    console.error("progress GET failed", e);
    return generic();
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!sameOrigin(req)) { await bump("origin_blocked"); return Response.json({ error: "Request refused." }, { status: 403, headers: noStore }); }
    const owner = await requireOwner(req);
    if (!owner) return await unauth();
    if (!(await progressWriteLimit().limit(owner)).success) { await bump("progress_rate_limited"); return tooMany(); }

    const text = await req.text();
    if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) {
      return Response.json({ error: "Progress data is too large." }, { status: 413, headers: noStore });
    }
    let body: unknown;
    try { body = JSON.parse(text); } catch { return Response.json({ error: "Progress data is invalid." }, { status: 400, headers: noStore }); }
    const parsed = ProgressSchema.safeParse(body);
    if (!parsed.success) return Response.json({ error: "Progress data is invalid." }, { status: 400, headers: noStore });

    await redis().set(key(owner), parsed.data);
    return Response.json({ ok: true }, { headers: noStore });
  } catch (e) {
    console.error("progress PUT failed", e);
    return generic();
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!sameOrigin(req)) { await bump("origin_blocked"); return Response.json({ error: "Request refused." }, { status: 403, headers: noStore }); }
    const owner = await requireOwner(req);
    if (!owner) return await unauth();
    if (!(await progressWriteLimit().limit(owner)).success) { await bump("progress_rate_limited"); return tooMany(); }
    await redis().del(key(owner));
    return Response.json({ ok: true }, { headers: noStore });
  } catch (e) {
    console.error("progress DELETE failed", e);
    return generic();
  }
}
