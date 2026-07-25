import { Router } from 'express';

import { sendMessage } from '../controllers/message.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { sendMessageSchema } from '../validations/message.validation.js';

const router = Router();

router.post('/:chatId/messages', authenticate, validate(sendMessageSchema), sendMessage);

export default router;
