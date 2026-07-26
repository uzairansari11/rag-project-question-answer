import authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/async.handler.js';
import { successResponse } from '../utils/response.js';

export const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);

  return successResponse({
    res,
    status: 200,
    message: 'Login successful',
    data,
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const data = await authService.profile(req.user.id);

  return successResponse({
    res,
    status: 200,
    message: 'Login successful',
    data,
  });
});

export const register = asyncHandler(async (req, res) => {
  const user = await authService.register(req.body);

  return successResponse({
    res,
    status: 201,
    message: 'Registration successful',
    data: user,
  });
});
