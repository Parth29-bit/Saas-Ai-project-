import { Router } from 'express';
import { getCustomers, getCustomerById, updateCustomerNotes } from '../controllers/customerController';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);
router.use(requireRole(['SUPER_ADMIN', 'ADMIN', 'AGENT']));

router.get('/', getCustomers);
router.get('/:id', getCustomerById);
router.patch('/:id/notes', updateCustomerNotes);

export default router;
