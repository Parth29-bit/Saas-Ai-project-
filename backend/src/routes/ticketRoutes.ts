import { Router } from 'express';
import { getTickets, getTicketById, createTicket, updateTicket, deleteTicket } from '../controllers/ticketController';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.get('/', getTickets);
router.get('/:id', getTicketById);
router.post('/', createTicket);
router.patch('/:id', updateTicket);
router.delete('/:id', requireRole(['SUPER_ADMIN', 'ADMIN']), deleteTicket);

export default router;
