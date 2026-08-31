import { Router } from 'express';
import { FeeController } from '../controllers/fee.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { z } from 'zod';

const router = Router();
const controller = new FeeController();

router.use(authenticate);

const createFeeSchema = z.object({
  studentId: z.string().uuid(),
  classId: z.string().uuid().optional(),
  type: z.enum(['tuition', 'transport', 'library', 'laboratory', 'sports', 'other']),
  description: z.string().optional(),
  amount: z.number().positive(),
  discount: z.number().min(0).optional(),
  fine: z.number().min(0).optional(),
  dueDate: z.string().datetime(),
  academicYear: z.string().optional(),
  term: z.string().optional(),
});

const payFeeSchema = z.object({
  amount: z.number().positive(),
  paymentMode: z.enum(['cash', 'card', 'bank_transfer', 'online']),
  transactionId: z.string().optional(),
});

router.post(
  '/',
  authorize('admin'),
  validate({ body: createFeeSchema }),
  controller.create.bind(controller)
);

router.post(
  '/:id/pay',
  authorize('admin'),
  validate({ body: payFeeSchema }),
  controller.payFee.bind(controller)
);

router.get(
  '/student/:studentId',
  authorize('admin', 'teacher', 'student'),
  controller.getStudentFees.bind(controller)
);

router.get(
  '/overdue',
  authorize('admin'),
  controller.getOverdueFees.bind(controller)
);

router.get(
  '/summary',
  authorize('admin'),
  controller.getFeeSummary.bind(controller)
);

export default router;