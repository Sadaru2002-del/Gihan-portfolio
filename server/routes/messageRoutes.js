import express from 'express';
import { getMessages, createMessage, updateMessageStatus, deleteMessage } from '../controllers/messageController.js';
import auth from '../middleware/auth.js';
import { authAndContactLimiter } from '../middleware/security.js';

const router = express.Router();

router.get('/', auth, getMessages);
router.post('/', authAndContactLimiter, createMessage);
router.put('/:id', auth, updateMessageStatus);
router.delete('/:id', auth, deleteMessage);

export default router;
