import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { validate } from '../middleware/validate.middleware';
import { createStudentSchema, updateStudentSchema } from '../schemas/student.schema';
import { paginationQuerySchema, uuidParamSchema } from '../schemas/common.schema';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const controller = new StudentController();

router.use(authenticate);

router.post(
  '/',
  authorize('admin'),
  validate({ body: createStudentSchema }),
  controller.create.bind(controller)
);

router.get(
  '/',
  authorize('admin', 'teacher'),
  validate({ query: paginationQuerySchema }),
  controller.findAll.bind(controller)
);

router.get(
  '/statistics',
  authorize('admin'),
  controller.getStatistics.bind(controller)
);

router.get(
  '/class/:classId',
  authorize('admin', 'teacher'),
  validate({ params: uuidParamSchema }),
  controller.findByClass.bind(controller)
);

router.get(
  '/:id',
  authorize('admin', 'teacher'),
  validate({ params: uuidParamSchema }),
  controller.findById.bind(controller)
);

router.put(
  '/:id',
  authorize('admin'),
  validate({ params: uuidParamSchema, body: updateStudentSchema }),
  controller.update.bind(controller)
);

router.delete(
  '/:id',
  authorize('admin'),
  validate({ params: uuidParamSchema }),
  controller.delete.bind(controller)
);

export default router;