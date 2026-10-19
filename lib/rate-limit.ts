import "server-only";

/**
 * Small fixed-window limiter keyed by IP. In-memory, so it is per server instance:
 * enough to blunt a spam burst, not a guarantee. Swap for Upstash/Redis if abused.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit = 5, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true as const };
  }
  if (entry.count >= limit) return { ok: false as const, retryInMin: Math.ceil((entry.resetAt - now) / 60000) };
  entry.count++;
  return { ok: true as const };
}
