import { Request, Response, NextFunction } from 'express';
import { JWTUtil } from '../utils/jwt.util';
import { ApiError } from '../utils/api-error.util';
import { createChildLogger } from '../config/logger.config';

const logger = createChildLogger('AuthMiddleware');

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticate = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Access token is required');
    }

    const token = authHeader.split(' ')[1];
    const payload = JWTUtil.verifyAccessToken(token);

    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        return next(ApiError.unauthorized('Access token has expired'));
      }
      if (error.name === 'JsonWebTokenError') {
        return next(ApiError.unauthorized('Invalid access token'));
      }
    }
    logger.error({ error }, 'Authentication failed');
    next(ApiError.unauthorized('Authentication failed'));
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(
        { userId: req.user.userId, role: req.user.role, requiredRoles: roles },
        'Authorization failed'
      );
      return next(ApiError.forbidden('You do not have permission to access this resource'));
    }

    next();
  };
};

export const optionalAuth = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = JWTUtil.verifyAccessToken(token);
      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };
    }
  } catch {
    // Optional auth - continue without user
  }
  next();
};
