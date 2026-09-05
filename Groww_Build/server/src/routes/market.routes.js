import { Router } from 'express';
import { getQuote, getHistoricalData, searchSymbols } from '../controllers/market.controller.js';
import { marketRateLimiter } from '../middleware/rateLimit.middleware.js';

const router = Router();

// Market data endpoints are rate-limited
router.get('/search', marketRateLimiter, searchSymbols);
router.get('/quote/:symbol', marketRateLimiter, getQuote);
router.get('/history/:symbol', marketRateLimiter, getHistoricalData);

export default router;
