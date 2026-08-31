import { Request, Response, NextFunction } from 'express';
import { feeService } from '../services/fee.service';
import { ApiResponseUtil } from '../utils/api-response.util';

export class FeeController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const fee = await feeService.create(req.body);
      res.status(201).json(ApiResponseUtil.success(fee, 'Fee record created successfully'));
    } catch (error) {
      next(error);
    }
  }

  async payFee(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await feeService.payFee(id as string, req.body.amount, req.body.paymentMode, req.body.transactionId);
      res.json(ApiResponseUtil.success(result, 'Payment recorded successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getStudentFees(req: Request, res: Response, next: NextFunction) {
    try {
      const { studentId } = req.params;
      const status = req.query.status as string;
      const result = await feeService.getStudentFees(studentId as string, status);
      res.json(ApiResponseUtil.success(result.items, 'Fees retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  async getOverdueFees(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await feeService.getOverdueFees();
      res.json(ApiResponseUtil.success(result.items, 'Overdue fees retrieved'));
    } catch (error) {
      next(error);
    }
  }

  async getFeeSummary(_req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await feeService.getFeeSummary();
      res.json(ApiResponseUtil.success(summary, 'Fee summary retrieved'));
    } catch (error) {
      next(error);
    }
  }
}