import { Router } from 'express';
import { AnnouncementController } from '../controllers/announcement.controller';
import { validate } from '../middleware/validate.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { z } from 'zod';

const router = Router();
const controller = new AnnouncementController();

router.use(authenticate);

const createAnnouncementSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().min(1),
  type: z.enum(['general', 'academic', 'event', 'holiday', 'emergency']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  targetAudience: z.string().optional(),
  targetClassId: z.string().uuid().optional(),
  expiresAt: z.string().datetime().optional(),
  isImportant: z.boolean().optional(),
});

router.post(
  '/',
  authorize('admin', 'teacher'),
  validate({ body: createAnnouncementSchema }),
  controller.create.bind(controller)
);

router.post(
  '/:id/publish',
  authorize('admin', 'teacher'),
  controller.publish.bind(controller)
);

router.get('/', controller.findAll.bind(controller));

router.get('/:id', controller.findById.bind(controller));

router.put(
  '/:id',
  authorize('admin', 'teacher'),
  validate({ body: createAnnouncementSchema.partial() }),
  controller.update.bind(controller)
);

router.delete(
  '/:id',
  authorize('admin'),
  controller.delete.bind(controller)
);

export default router;