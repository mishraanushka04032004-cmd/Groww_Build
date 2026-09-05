import rateLimit from 'express-rate-limit';
import { AppError } from '../utils/AppError.js';

const rateLimitErrorHandler = (message) => (req, res, next) => {
  next(new AppError(message, 429, 'RATE_LIMIT_EXCEEDED'));
};

// Strict rate limiter for authentication endpoints (prevents brute-force)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // 15 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitErrorHandler('Too many login/registration attempts. Please try again later.'),
});

// Moderate rate limiter for market search and queries
export const marketRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitErrorHandler('Market query rate limit exceeded. Please wait a moment.'),
});

// General API rate limiter
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitErrorHandler('Too many requests. Please slow down.'),
});
