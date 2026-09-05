import { Router } from 'express';
import { getDashboard, acknowledgeChanges } from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', getDashboard);
router.patch('/acknowledge', acknowledgeChanges);

export default router;
