import { ZodError } from 'zod';
import { ApiError } from '../utils/api-error.js';

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const parsedData = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      req.body = parsedData.body;
      req.params = parsedData.params;
      req.query = parsedData.query;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new ApiError(400, 'Validation failed', error.flatten()));
      }

      next(error);
    }
  };
};
