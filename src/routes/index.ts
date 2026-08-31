import { Router } from 'express';
import authRoutes from './auth.routes';
import studentRoutes from './student.routes';
import teacherRoutes from './teacher.routes';
import classRoutes from './class.routes';
import attendanceRoutes from './attendance.routes';
import gradeRoutes from './grade.routes';
import feeRoutes from './fee.routes';
import announcementRoutes from './announcement.routes';
import healthRoutes from './health.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);
router.use('/classes', classRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/grades', gradeRoutes);
router.use('/fees', feeRoutes);
router.use('/announcements', announcementRoutes);
router.use('/health', healthRoutes);

export default router;