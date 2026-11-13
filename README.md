# FedRAMP Quest

A 16-bit RPG for learning FedRAMP (Rev 5, VDR, VER and 20x). Each module is a short primer from Dot, a recap card, and a five-decision business scenario.

- **Play:** anyone with the link can play as a guest. Guest progress is never stored.
- **Save:** only the owner (one Google account, set by `OWNER_EMAIL`) can sign in. Progress is stored in Upstash Redis.

## How it's built

| Part | What it does |
| --- | --- |
| `public/index.html`, `game.css`, `game.js` | The game. Static files, no inline scripts or styles, so the CSP can be strict. |
| `app/api/auth/[...nextauth]` | Google sign-in (NextAuth v4). Only the owner's verified Google email is allowed. Rate limited by IP. |
| `app/api/progress` | Get, save and delete the owner's progress. Every call re-checks the session server-side, validates the body with zod, and is rate limited. |
| `lib/auth.ts` | Session rules. 7-day JWT sessions; signing out bumps a version in Redis so old tokens stop working. |
| `next.config.mjs` | Security headers: CSP, HSTS, nosniff, frame-deny, referrer and permissions policies. |

## Deploy on Vercel

1. **Upstash Redis.** In Vercel, open the project's Storage tab (or the Marketplace) and add Upstash Redis. Connect it to this project. It adds the connection settings automatically, named either `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` or `KV_REST_API_URL`/`KV_REST_API_TOKEN`; the app accepts both. If you create the database at console.upstash.com instead, copy those two values yourself.
2. **Google sign-in.** In Google Cloud Console, go to APIs & Services, then Credentials, and create an OAuth client ID of type "Web application".
   - Authorized JavaScript origin: `https://<your-domain>`
   - Authorized redirect URI: `https://<your-domain>/api/auth/callback/google`
   - Copy the client ID and secret.
3. **Import the repo** into Vercel (Add New, then Project).
4. **Environment variables** (Settings, then Environment Variables). See `.env.example`:
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`: a random value. Generate one at your terminal with `openssl rand -base64 32`, or ask Claude for one.
   - `NEXTAUTH_URL`: your site URL, for example `https://fedramp-quest.vercel.app`
   - `OWNER_EMAIL`: the Google account allowed to sign in
5. **Redeploy** so the variables take effect.

## Security notes

- Deny by default: sign-in is refused for every account except `OWNER_EMAIL`, and the progress API checks the owner, token expiry and sign-out version on every call.
- No passwords are stored; Google handles credentials.
- Writes require a same-origin `Origin` header, so other sites can't post to the API.
- Errors shown to players are generic; details go to Vercel's server logs only.
- `# SECURITY TODO:` the rate limiter keys on `x-forwarded-for`, which Vercel sets. If this app ever moves off Vercel, revisit how the client IP is read.
- There's no CAPTCHA on sign-in. That's acceptable because only one Google account can get through, and Google runs its own abuse checks on its sign-in page.

## Content accuracy

Primer and scenario content was checked against fedramp.gov on 2026-11-13. FedRAMP rules change through its public process; recap cards show the check date.
