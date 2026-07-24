import { asyncHandler } from '../utils/async.handler.js';
import authService from '../services/auth.service.js';

export const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data,
  });
});

export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});
