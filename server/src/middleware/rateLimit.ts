import type { Request, Response, NextFunction } from 'express';

interface RateLimitEntry {
  count: number;
  resetAt: number; // unix ms
}

// In-memory store: IP → entry
const store = new Map<string, RateLimitEntry>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIP(req: Request): string {
  // Trust X-Forwarded-For behind a proxy; fallback to socket address
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress ?? '0.0.0.0';
}

export function loginRateLimiter(req: Request, res: Response, next: NextFunction): void {
  const ip = getClientIP(req);
  const now = Date.now();

  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    // First attempt in this window
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    next();
    return;
  }

  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfterSecs = Math.ceil((entry.resetAt - now) / 1000);
    res.setHeader('Retry-After', retryAfterSecs);
    res.status(429).json({
      error: 'Too many login attempts',
      retryAfterSeconds: retryAfterSecs,
      message: `Too many login attempts. Try again in ${Math.ceil(retryAfterSecs / 60)} minute(s).`,
    });
    return;
  }

  // Increment within current window
  store.set(ip, { count: entry.count + 1, resetAt: entry.resetAt });
  next();
}

// Reset limit on successful login (call from auth route)
export function resetLoginLimit(req: Request): void {
  const ip = getClientIP(req);
  store.delete(ip);
}
