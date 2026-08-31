import { Request, Response, NextFunction } from 'express';
import { classService } from '../services/class.service';
import { ApiResponseUtil } from '../utils/api-response.util';

export class ClassController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const cls = await classService.create(req.body);
      res.status(201).json(ApiResponseUtil.success(cls, 'Class created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 20,
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc',
        academicYear: req.query.academicYear as string,
        status: req.query.status as string,
      };

      const result = await classService.findAll(query);
      res.json(ApiResponseUtil.paginated(result.items, result.total, result.page, result.limit));
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const cls = await classService.findById(req.params.id as string);
      res.json(ApiResponseUtil.success(cls, 'Class retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const cls = await classService.update(req.params.id as string, req.body);
      res.json(ApiResponseUtil.success(cls, 'Class updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await classService.delete(req.params.id as string);
      res.json(ApiResponseUtil.success(null, result.message));
    } catch (error) {
      next(error);
    }
  }
}