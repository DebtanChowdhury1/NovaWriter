type RateLimitOptions = {
  key: string;
  windowMs?: number;
  max?: number;
};

const DEFAULT_WINDOW = 60_000;
const DEFAULT_MAX = 10;

const requestLog = new Map<string, number[]>();

export function checkRateLimit({
  key,
  windowMs = DEFAULT_WINDOW,
  max = DEFAULT_MAX,
}: RateLimitOptions) {
  const now = Date.now();
  const windowStart = now - windowMs;

  const entries = requestLog.get(key)?.filter((timestamp) => timestamp > windowStart) ?? [];

  if (entries.length >= max) {
    const retryAfter = Math.ceil((entries[0] + windowMs - now) / 1000);
    return {
      success: false,
      retryAfter: retryAfter > 0 ? retryAfter : 1,
    };
  }

  entries.push(now);
  requestLog.set(key, entries);

  return { success: true };
}
