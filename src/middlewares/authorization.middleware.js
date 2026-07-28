import { ApiError } from '../utils/api-error.js';

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, "You don't have access to this resource");
    }

    next();
  };
};
