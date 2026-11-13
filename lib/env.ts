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
