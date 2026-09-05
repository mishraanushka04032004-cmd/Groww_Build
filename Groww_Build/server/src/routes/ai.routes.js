import { Router } from 'express';
import { getAIBriefing } from '../controllers/ai.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Route: GET /api/v1/ai/briefing/:symbol (authenticated)
router.get('/briefing/:symbol', requireAuth, getAIBriefing);

export default router;
