import type { Request, Response, NextFunction } from "express";

type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

/**
 * Resolve the client IP. Relies on Express `trust proxy` being configured
 * (it is set in server/auth.ts) so that `req.ip` reflects the first hop of
 * the trusted reverse proxy chain. We deliberately do NOT read
 * `x-forwarded-for` ourselves — that would allow spoofing when the header
 * is supplied directly by a client.
 */
function clientIp(req: Request): string {
  return req.ip || req.socket.remoteAddress || "unknown";
}

/**
 * Simple fixed-window in-memory rate limiter. Keyed by IP + route key.
 * Suitable for single-instance deployments; replace with a Redis-backed
 * limiter when horizontally scaled.
 */
export function rateLimit(opts: { windowMs: number; max: number; key: string }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = clientIp(req);
    const bucketKey = `${opts.key}:${ip}`;
    const now = Date.now();
    const entry = buckets.get(bucketKey);

    if (!entry || entry.resetAt <= now) {
      buckets.set(bucketKey, { count: 1, resetAt: now + opts.windowMs });
      return next();
    }

    entry.count += 1;
    if (entry.count > opts.max) {
      const retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));
      res.set("Retry-After", String(retryAfter));
      return res.status(429).json({
        error: "Too many requests",
        message: "You've hit the rate limit. Please try again later.",
      });
    }
    next();
  };
}

// Periodic cleanup of expired buckets so the map doesn't grow unbounded.
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  buckets.forEach((v, k) => {
    if (v.resetAt <= now) buckets.delete(k);
  });
}, 10 * 60 * 1000);
cleanupTimer.unref?.();
