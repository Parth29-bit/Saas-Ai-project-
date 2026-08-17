import { Router } from 'express';
import { addMessage } from '../controllers/messageController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);
router.post('/', addMessage);

export default router;
