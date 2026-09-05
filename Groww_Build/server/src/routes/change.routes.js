import { Router } from 'express';
import { getChangeHistory } from '../controllers/change.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/:symbol', getChangeHistory);

export default router;
