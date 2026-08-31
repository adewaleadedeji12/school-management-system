import { Router } from 'express';
import { ClassController } from '../controllers/class.controller';
import { validate } from '../middleware/validate.middleware';
import { createClassSchema, updateClassSchema } from '../schemas/class.schema';
import { paginationQuerySchema, uuidParamSchema } from '../schemas/common.schema';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();
const controller = new ClassController();

router.use(authenticate);

router.post(
  '/',
  authorize('admin'),
  validate({ body: createClassSchema }),
  controller.create.bind(controller)
);

router.get(
  '/',
  authorize('admin', 'teacher'),
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
  validate({ params: uuidParamSchema, body: updateClassSchema }),
  controller.update.bind(controller)
);

router.delete(
  '/:id',
  authorize('admin'),
  validate({ params: uuidParamSchema }),
  controller.delete.bind(controller)
);

export default router;