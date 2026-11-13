import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { env, ownerEmail } from "./env";
import { redis } from "./redis";
import { bump } from "./stats";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const verKey = (email: string) => `fq:sessver:${email}`;

// Session version: bumped on sign-out so every token issued before it stops working,
// even though sessions are stateless JWTs.
export async function currentSessionVersion(email: string): Promise<number> {
  const v = await redis().get<number>(verKey(email));
  return typeof v === "number" ? v : 0;
}

// Built on first request, not at import, so a build without secrets still succeeds
// and a missing secret fails closed at runtime.
export function buildAuthOptions(): NextAuthOptions {
  return {
  secret: env("NEXTAUTH_SECRET"),
  providers: [
    GoogleProvider({
      clientId: env("GOOGLE_CLIENT_ID"),
      clientSecret: env("GOOGLE_CLIENT_SECRET"),
    }),
  ],
  session: { strategy: "jwt", maxAge: SESSION_MAX_AGE },
  jwt: { maxAge: SESSION_MAX_AGE },
  pages: { signIn: "/", error: "/?auth=error" },
  callbacks: {
    // Deny by default: only the owner's verified Google account may sign in.
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return false;
      const p = profile as { email?: string; email_verified?: boolean } | undefined;
      const email = p?.email?.toLowerCase();
      const ok = p?.email_verified === true && !!email && email === ownerEmail();
      if (!ok) await bump("signin_denied");
      return ok;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const email = user.email.toLowerCase();
        token.email = email;
        token.role = email === ownerEmail() ? "owner" : "none";
        token.ver = await currentSessionVersion(email);
      }
      return token;
    },
    async session({ session, token }) {
      // Expose only what the client needs: that someone is signed in.
      return { expires: session.expires, user: { name: session.user?.name ?? null } };
    },
    async redirect({ url, baseUrl }) {
      // Only ever redirect back to this site.
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try { if (new URL(url).origin === baseUrl) return url; } catch { /* fall through */ }
      return baseUrl;
    },
  },
  events: {
    async signOut({ token }) {
      const email = typeof token?.email === "string" ? token.email : null;
      if (email) await redis().incr(verKey(email));
    },
  },
  };
}
