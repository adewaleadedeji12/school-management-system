import { Router } from 'express';
import { GradeController } from '../controllers/grade.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { z } from 'zod';

const router = Router();
const controller = new GradeController();

router.use(authenticate);

const addGradeSchema = z.object({
  studentId: z.string().uuid(),
  examId: z.string().uuid().optional(),
  subjectId: z.string().uuid().optional(),
  marksObtained: z.number().min(0),
  totalMarks: z.number().min(1),
  remarks: z.string().optional(),
});

router.post(
  '/',
  authorize('admin', 'teacher'),
  validate({ body: addGradeSchema }),
  controller.addGrade.bind(controller)
);

router.get(
  '/student/:studentId',
  authorize('admin', 'teacher', 'student'),
  controller.getStudentGrades.bind(controller)
);

router.get(
  '/exam/:examId',
  authorize('admin', 'teacher'),
  controller.getExamGrades.bind(controller)
);

router.get(
  '/gpa/:studentId',
  authorize('admin', 'teacher', 'student'),
  controller.calculateGPA.bind(controller)
);

export default router;