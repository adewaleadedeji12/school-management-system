import { eq } from 'drizzle-orm';
import { BaseRepository } from './base.repository';
import { teachers } from '../models/teacher.model';
import { db } from '../config/database.config';

export class TeacherRepository extends BaseRepository {
  constructor() {
    super(teachers);
  }

  async findByEmployeeId(employeeId: string) {
    const result = await db
      .select()
      .from(teachers)
      .where(eq(teachers.employeeId, employeeId))
      .limit(1);

    return result[0] || null;
  }

  async findByUserId(userId: string) {
    const result = await db
      .select()
      .from(teachers)
      .where(eq(teachers.userId, userId))
      .limit(1);

    return result[0] || null;
  }
}