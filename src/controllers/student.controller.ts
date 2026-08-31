import { Request, Response, NextFunction } from 'express';
import { studentService } from '../services/student.service';
import { ApiResponseUtil } from '../utils/api-response.util';

export class StudentController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await studentService.create(req.body);
      res.status(201).json(ApiResponseUtil.success(student, 'Student created successfully'));
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
        classId: req.query.classId as string,
        status: req.query.status as string,
      };

      const result = await studentService.findAll(query);
      res.json(
        ApiResponseUtil.paginated(
          result.items,
          result.total,
          result.page,
          result.limit,
          'Students retrieved successfully'
        )
      );
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await studentService.findById(req.params.id as string);
      res.json(ApiResponseUtil.success(student, 'Student retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await studentService.update(req.params.id as string, req.body);
      res.json(ApiResponseUtil.success(student, 'Student updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await studentService.delete(req.params.id as string);
      res.json(ApiResponseUtil.success(null, result.message));
    } catch (error) {
      next(error);
    }
  }

  async findByClass(req: Request, res: Response, next: NextFunction) {
    try {
      const classId = req.params.classId as string;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 50;
      const result = await studentService.findByClass(classId, page, limit);
      res.json(ApiResponseUtil.paginated(result.items, result.total, result.page, result.limit));
    } catch (error) {
      next(error);
    }
  }

  async getStatistics(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await studentService.getStatistics();
      res.json(ApiResponseUtil.success(stats, 'Statistics retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }
}