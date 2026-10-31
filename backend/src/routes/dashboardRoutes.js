import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { summary, reports } from '../controllers/dashboardController.js';

const router = Router();
router.use(protect);
router.get('/summary', summary);
router.get('/reports', reports);

export default router;
