import express from 'express';

import { UserRole } from '@prisma/client';
import { userController } from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/authorization.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { updateProfileSchema } from '../validations/user.validation.js';

const router = express.Router();

router.use(authenticate);
router.get('/', authorize(UserRole.ADMIN), userController.getUsers);

router.get('/me', userController.getProfile);

router.patch('/me', validate(updateProfileSchema), userController.updateProfile);

// router.delete('/me', getProfile);

export default router;
