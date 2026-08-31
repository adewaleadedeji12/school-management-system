import { Request, Response, NextFunction } from 'express';
import { attendanceService } from '../services/attendance.service';
import { ApiResponseUtil } from '../utils/api-response.util';
import type { AuthenticatedRequest } from '../middleware/auth.middleware';

export class AttendanceController {
  async markAttendance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const record = await attendanceService.markAttendance(req.body, req.user?.userId);
      res.status(201).json(ApiResponseUtil.success(record, 'Attendance marked successfully'));
    } catch (error) {
      next(error);
    }
  }

  async markBulkAttendance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const records = await attendanceService.markBulkAttendance(req.body.records, req.user?.userId);
      res.status(201).json(ApiResponseUtil.success(records, 'Bulk attendance marked successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getStudentAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const result = await attendanceService.getStudentAttendance(studentId as string);
      res.json(ApiResponseUtil.success(result.items, 'Attendance retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getClassAttendance(req: Request, res: Response, next: NextFunction) {
    try {
      const { classId } = req.params;
      const date = req.query.date as string;
      const result = await attendanceService.getClassAttendance(classId as string, date);
      res.json(ApiResponseUtil.success(result.items, 'Class attendance retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async getAttendanceSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const summary = await attendanceService.getAttendanceSummary(studentId as string);
      res.json(ApiResponseUtil.success(summary, 'Attendance summary retrieved'));
    } catch (error) {
      next(error);
    }
  }
}