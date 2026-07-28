import prisma from '../lib/prisma.js';
import { ApiError } from '../utils/api-error.js';
import { asyncHandler } from '../utils/async.handler.js';
import { verifyAccessToken } from '../utils/jwt.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new ApiError(401, 'Authorization header is required');
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new ApiError(401, 'Invalid authorization header');
  }

  const decoded = verifyAccessToken(token);
  const user = await prisma.user.findUnique({
    where: {
      id: decoded.userId,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  req.user = user;

  next();
});
