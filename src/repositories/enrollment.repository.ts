import { eq, and } from 'drizzle-orm';
import { BaseRepository } from './base.repository';
import { enrollments } from '../models/enrollment.model';
import { db } from '../config/database.config';

export class EnrollmentRepository extends BaseRepository {
  constructor() {
    super(enrollments);
  }

  async findByStudentAndClass(studentId: string, classId: string) {
    const result = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.studentId, studentId),
          eq(enrollments.classId, classId)
        )
      )
      .limit(1);

    return result[0] || null;
  }

  async findByAcademicYear(academicYear: string) {
    const result = await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.academicYear, academicYear));

    return result;
  }
}