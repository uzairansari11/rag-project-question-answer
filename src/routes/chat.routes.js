import { Router } from 'express';
import { createChat, getChats } from '../controllers/chat.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { createChatSchema, getChatsSchema } from '../validations/chat.validation.js';

const router = Router();

router.post('/', authenticate, validate(createChatSchema), createChat);
router.get('/', authenticate, validate(getChatsSchema), getChats);

export default router;
