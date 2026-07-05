import express from 'express';
import { logEvent, getStats } from '../controllers/analyticsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/log', logEvent);
router.get('/stats', auth, getStats);

export default router;
