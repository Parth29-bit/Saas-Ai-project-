import { Router } from 'express';
import { getSettings, updateOrgSettings, updateProfile } from '../controllers/settingsController';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);
router.get('/', getSettings);
router.patch('/profile', updateProfile);
router.patch('/organization', requireRole(['SUPER_ADMIN', 'ADMIN']), updateOrgSettings);

export default router;
