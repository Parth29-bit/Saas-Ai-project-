import { Router } from 'express';
import { getArticles, getArticleBySlug, createArticle, updateArticle, deleteArticle } from '../controllers/kbController';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

// Public routes for Help Center
router.get('/articles', getArticles);
router.get('/articles/:slug', getArticleBySlug);

// Protected routes for CMS management
router.post('/articles', authenticateJWT, requireRole(['SUPER_ADMIN', 'ADMIN', 'AGENT']), createArticle);
router.put('/articles/:id', authenticateJWT, requireRole(['SUPER_ADMIN', 'ADMIN', 'AGENT']), updateArticle);
router.delete('/articles/:id', authenticateJWT, requireRole(['SUPER_ADMIN', 'ADMIN']), deleteArticle);

export default router;
