import { Router } from 'express';
import { generateReply, summarizeTicket, analyzeSentiment, customerChat, rewriteText } from '../controllers/aiController';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);

router.post('/generate-reply', generateReply);
router.post('/summarize', summarizeTicket);
router.post('/sentiment', analyzeSentiment);
router.post('/chat', customerChat);
router.post('/rewrite', rewriteText);

export default router;
