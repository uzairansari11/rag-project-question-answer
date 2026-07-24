import { asyncHandler } from '../middlewares/async.handler.js';
import authService from '../services/auth.service.js';

export const login = (req, res) => {
  res.json({ message: 'auth controller placeholder' });
};

export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});
