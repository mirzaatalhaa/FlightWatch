import { config } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  // Log the complete error detail for local console debugging
  console.error('API Error:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  const response = {
    success: false,
    message
  };

  // Append stack trace if in development mode
  if (!config.isProd && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
