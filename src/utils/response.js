export const successResponse = ({ res, status = 200, message, data }) => {
  const payload = {
    success: true,
    message: message || 'OK',
  };

  if (data !== undefined) {
    payload.data = data;
  }

  return res.status(status).json(payload);
};

export const errorResponse = ({ res, status = 500, message, errors }) => {
  const payload = {
    success: false,
    message: message || 'Internal Server Error',
  };

  if (errors !== undefined) {
    payload.errors = errors;
  }

  return res.status(status).json(payload);
};
