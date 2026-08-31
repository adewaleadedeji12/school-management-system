import { Request, Response, NextFunction } from 'express';
import { teacherService } from '../services/teacher.service';
import { ApiResponseUtil } from '../utils/api-response.util';

export class TeacherController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const teacher = await teacherService.create(req.body);
      res.status(201).json(ApiResponseUtil.success(teacher, 'Teacher created successfully'));
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
        department: req.query.department as string,
        designation: req.query.designation as string,
      };

      const result = await teacherService.findAll(query);
      res.json(ApiResponseUtil.paginated(result.items, result.total, result.page, result.limit));
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const teacher = await teacherService.findById(req.params.id as string);
      res.json(ApiResponseUtil.success(teacher, 'Teacher retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const teacher = await teacherService.update(req.params.id as string, req.body);
      res.json(ApiResponseUtil.success(teacher, 'Teacher updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await teacherService.delete(req.params.id as string);
      res.json(ApiResponseUtil.success(null, result.message));
    } catch (error) {
      next(error);
    }
  }
}