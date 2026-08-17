import { Router } from 'express';
import { getAutomations, createAutomation, toggleAutomation, deleteAutomation } from '../controllers/automationController';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);
router.use(requireRole(['SUPER_ADMIN', 'ADMIN']));

router.get('/', getAutomations);
router.post('/', createAutomation);
router.patch('/:id/toggle', toggleAutomation);
router.delete('/:id', deleteAutomation);

export default router;
