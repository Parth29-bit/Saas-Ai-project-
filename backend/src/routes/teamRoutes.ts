import { Router } from 'express';
import { getTeamMembers, inviteTeamMember, updateMemberRole } from '../controllers/teamController';
import { authenticateJWT, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticateJWT);
router.use(requireRole(['SUPER_ADMIN', 'ADMIN']));

router.get('/', getTeamMembers);
router.post('/invite', inviteTeamMember);
router.patch('/:id/role', updateMemberRole);

export default router;
