import { Router } from 'express';
import { protect, requireRole } from '../middleware/auth.js';
import { list } from '../controllers/activityController.js';

const router = Router();
// The full log is only for admins; staff see just the latest items on the dashboard.
router.get('/', protect, requireRole('admin'), list);

export default router;
