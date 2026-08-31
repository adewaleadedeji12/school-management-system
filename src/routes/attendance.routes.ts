import { Router } from 'express';
import { AttendanceController } from '../controllers/attendance.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { z } from 'zod';

const router = Router();
const controller = new AttendanceController();

router.use(authenticate);

const markAttendanceSchema = z.object({
  studentId: z.string().uuid(),
  classId: z.string().uuid().optional(),
  date: z.string().datetime(),
  status: z.enum(['present', 'absent', 'late', 'excused', 'half_day']),
  remarks: z.string().optional(),
  subjectId: z.string().uuid().optional(),
});

const bulkAttendanceSchema = z.object({
  records: z.array(markAttendanceSchema),
});

router.post(
  '/mark',
  authorize('admin', 'teacher'),
  validate({ body: markAttendanceSchema }),
  controller.markAttendance.bind(controller)
);

router.post(
  '/mark-bulk',
  authorize('admin', 'teacher'),
  validate({ body: bulkAttendanceSchema }),
  controller.markBulkAttendance.bind(controller)
);

router.get(
  '/student/:studentId',
  authorize('admin', 'teacher', 'student'),
  controller.getStudentAttendance.bind(controller)
);

router.get(
  '/class/:classId',
  authorize('admin', 'teacher'),
  controller.getClassAttendance.bind(controller)
);

router.get(
  '/summary/:studentId',
  authorize('admin', 'teacher', 'student'),
  controller.getAttendanceSummary.bind(controller)
);

export default router;
