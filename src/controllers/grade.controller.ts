import { Request, Response, NextFunction } from 'express';
import { gradeService } from '../services/grade.service';
import { ApiResponseUtil } from '../utils/api-response.util';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';

export class GradeController {
  async addGrade(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const grade = await gradeService.addGrade(req.body, req.user?.userId);
      res.status(201).json(ApiResponseUtil.success(grade, 'Grade added successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getStudentGrades(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const examId = req.query.examId as string;
      const result = await gradeService.getStudentGrades(studentId as string, examId);
      res.json(ApiResponseUtil.success(result.items, 'Grades retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getExamGrades(req: Request, res: Response, next: NextFunction) {
    try {
      const { examId } = req.params;
      const result = await gradeService.getExamGrades(examId as string);
      res.json(ApiResponseUtil.success(result.items, 'Exam grades retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async calculateGPA(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const gpa = await gradeService.calculateStudentGPA(studentId as string);
      res.json(ApiResponseUtil.success(gpa, 'GPA calculated successfully'));
    } catch (error) {
      next(error);
    }
  }
}