export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error({
    message: err.message,
    stack: err.stack,
    cause: err.cause,
    err,
  });
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
};
