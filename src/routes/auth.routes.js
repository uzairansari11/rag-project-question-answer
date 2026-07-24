import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { loginSchema, registerSchema } from '../validations/auth.validation.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);

router.post('/login', validate(loginSchema), login);
export default router;
