import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/api-error.util';
import { ApiResponseUtil } from '../utils/api-response.util';
import { createChildLogger } from '../config/logger.config';
import { env } from '../config/env.config';

const logger = createChildLogger('ErrorMiddleware');

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ApiError) {
    logger.warn(
      {
        statusCode: err.statusCode,
        message: err.message,
        path: req.path,
        method: req.method,
        errors: err.errors,
      },
      'API Error'
    );

    return res.status(err.statusCode).json(ApiResponseUtil.error(err.message, err.errors));
  }

  if (err.name === 'SyntaxError' && 'status' in err) {
    logger.warn({ error: err.message, path: req.path }, 'Syntax Error');
    return res.status(400).json(ApiResponseUtil.error('Invalid JSON payload'));
  }

  if (err.name === 'PayloadTooLargeError') {
    logger.warn({ path: req.path }, 'Payload too large');
    return res.status(413).json(ApiResponseUtil.error('Request payload too large'));
  }

  logger.error(
    {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    },
    'Unhandled Error'
  );

  const message = env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
  return res.status(500).json(ApiResponseUtil.error(message));
};

export const notFoundHandler = (req: Request, res: Response) => {
  logger.warn({ path: req.path, method: req.method }, 'Route not found');
  res.status(404).json(ApiResponseUtil.error(`Route ${req.method} ${req.path} not found`));
};