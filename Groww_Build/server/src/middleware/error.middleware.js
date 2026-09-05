import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { sendError } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.isOperational || env.NODE_ENV !== 'production' 
    ? err.message 
    : 'An unexpected internal error occurred';

  // Log error
  if (statusCode >= 500) {
    logger.error({
      err: {
        message: err.message,
        stack: err.stack,
        code: err.code,
      },
      req: {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
      },
    }, 'Server Error');
  } else {
    logger.warn({
      code: err.code,
      message: err.message,
      url: req.originalUrl,
      method: req.method,
    }, 'Client Error');
  }

  return sendError(res, message, statusCode, code, err.details || null);
};
