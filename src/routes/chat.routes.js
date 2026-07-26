import { Router } from 'express';
import {
  createChat,
  deleteChat,
  getChat,
  getChats,
  updateChat,
} from '../controllers/chat.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createChatSchema,
  deleteChatSchema,
  getChatSchema,
  getChatsSchema,
  updateChatsSchema,
} from '../validations/chat.validation.js';

const router = Router();

router.post('/', authenticate, validate(createChatSchema), createChat);
router.get('/', authenticate, validate(getChatsSchema), getChats);
router.get('/:chatId', authenticate, validate(getChatSchema), getChat);
router.patch('/:chatId', authenticate, validate(updateChatsSchema), updateChat);
router.delete('/:chatId', authenticate, validate(deleteChatSchema), deleteChat);

export default router;
