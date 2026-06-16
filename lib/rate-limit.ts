// In-memory sliding-window rate limiter.
// For multi-instance deployments, swap this for an Upstash/Redis store.
const store = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit: number, windowSeconds: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.reset) {
    store.set(key, { count: 1, reset: now + windowSeconds * 1000 });
    return true;
  }

  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}
