import { userService } from '../services/user.service.js';
import { asyncHandler } from '../utils/async.handler.js';
import { successResponse } from '../utils/response.js';
class UserController {
  getUsers = asyncHandler(async (req, res) => {
    const users = await userService.getUser();
    return successResponse({
      res,
      status: 200,
      data: users,
      message: 'User data fetch successfully.',
    });
  });
  getProfile = asyncHandler(async (req, res) => {
    const users = await userService.getProfile({ userId: req.user.id });
    return successResponse({
      res,
      status: 200,
      data: users,
      message: 'User data fetch successfully.',
    });
  });

  updateProfile = asyncHandler(async (req, res) => {
    const users = await userService.updateProfile({ userId: req.user.id, data: req.body });
    return successResponse({
      res,
      status: 200,
      data: users,
      message: 'User data fetch successfully.',
    });
  });
}

export const userController = new UserController();
