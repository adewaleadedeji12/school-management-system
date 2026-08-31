import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { ApiResponseUtil } from '../utils/api-response.util';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(ApiResponseUtil.success(user, 'Registration successful. Please check your email to verify your account.'));
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const ipAddress = req.ip || req.socket.remoteAddress;
      const result = await authService.login(req.body, ipAddress);
      
      res.cookie('refreshToken', result.tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json(ApiResponseUtil.success(result, 'Login successful'));
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.forgotPassword(req.body.email);
      res.json(ApiResponseUtil.success(result, result.message));
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.resetPassword(req.body);
      res.json(ApiResponseUtil.success(null, result.message));
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.changePassword(req.user!.userId, req.body);
      res.json(ApiResponseUtil.success(null, result.message));
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.refreshToken(req.body.refreshToken);
      
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.json(ApiResponseUtil.success(result, 'Token refreshed successfully'));
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await authService.logout(req.user!.userId);
      res.clearCookie('refreshToken');
      res.json(ApiResponseUtil.success(null, result.message));
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.query.token as string;
      const result = await authService.verifyEmail(token);
      res.json(ApiResponseUtil.success(null, result.message));
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await authService.getProfile(req.user!.userId);
      res.json(ApiResponseUtil.success(profile, 'Profile retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const profile = await authService.updateProfile(req.user!.userId, req.body);
      res.json(ApiResponseUtil.success(profile, 'Profile updated successfully'));
    } catch (error) {
      next(error);
    }
  }
}