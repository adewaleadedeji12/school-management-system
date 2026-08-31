import { Router } from 'express';
import { TeacherController } from '../controllers/teacher.controller';
import { validate } from '../middleware/validate.middleware';
import { createTeacherSchema, updateTeacherSchema } from '../schemas/teacher.schema';
import { paginationQuerySchema, uuidParamSchema } from '../schemas/common.schema';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const controller = new TeacherController();

router.use(authenticate);

router.post(
  '/',
  authorize('admin'),
  validate({ body: createTeacherSchema }),
  controller.create.bind(controller)
);

router.get(
  '/',
  authorize('admin'),
  validate({ query: paginationQuerySchema }),
  controller.findAll.bind(controller)
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
  validate({ params: uuidParamSchema, body: updateTeacherSchema }),
  controller.update.bind(controller)
);

router.delete(
  '/:id',
  authorize('admin'),
  validate({ params: uuidParamSchema }),
  controller.delete.bind(controller)
);

export default router;