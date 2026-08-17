import { Router } from 'express';
import { getOverviewMetrics } from '../controllers/analyticsController';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);
router.use(requireRole(['SUPER_ADMIN', 'ADMIN', 'AGENT']));

router.get('/overview', getOverviewMetrics);

export default router;
