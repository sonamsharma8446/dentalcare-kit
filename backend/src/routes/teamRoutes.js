import { Router } from 'express';
import { protect, requireRole } from '../middleware/auth.js';
import { validateId } from '../utils/helpers.js';
import { list, create, update, resetPassword } from '../controllers/teamController.js';

const router = Router();
// Managing the team is only for admins.
router.use(protect, requireRole('admin'));
router.get('/', list);
router.post('/', create);
router.put('/:id', validateId, update);
router.post('/:id/password', validateId, resetPassword);

export default router;
