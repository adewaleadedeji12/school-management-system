import { Request, Response, NextFunction } from 'express';
import { announcementService } from '../services/announcement.service';
import { ApiResponseUtil } from '../utils/api-response.util';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';

export class AnnouncementController {
  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const announcement = await announcementService.create(req.body, req.user!.userId);
      res.status(201).json(ApiResponseUtil.success(announcement, 'Announcement created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async publish(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const announcement = await announcementService.publish(req.params.id as string, req.user!.userId);
      res.json(ApiResponseUtil.success(announcement, 'Announcement published successfully'));
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
        type: req.query.type as string,
        published: req.query.published === 'true' ? true : undefined,
      };

      const result = await announcementService.findAll(query);
      res.json(ApiResponseUtil.paginated(result.items, result.total, result.page, result.limit));
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const announcement = await announcementService.findById(req.params.id as string);
      res.json(ApiResponseUtil.success(announcement, 'Announcement retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const announcement = await announcementService.update(req.params.id as string, req.body);
      res.json(ApiResponseUtil.success(announcement, 'Announcement updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await announcementService.delete(req.params.id as string);
      res.json(ApiResponseUtil.success(null, result.message));
    } catch (error) {
      next(error);
    }
  }
}