// Reads required configuration from environment variables. Fails closed:
// a missing value throws at request time rather than running half-configured.
export function env(name: string): string {
  const v = process.env[name];
  if (!v || !v.trim()) throw new Error(`Missing required environment variable ${name}`);
  return v.trim();
}

export function ownerEmail(): string {
  return env("OWNER_EMAIL").toLowerCase();
}

// Returns the first of several names that is set. The Vercel Upstash integration
// has used both UPSTASH_REDIS_REST_* and KV_REST_API_* names, so accept either.
export function envAny(...names: string[]): string {
  for (const n of names) { const v = process.env[n]; if (v && v.trim()) return v.trim(); }
  throw new Error(`Missing required environment variable: one of ${names.join(", ")}`);
}
