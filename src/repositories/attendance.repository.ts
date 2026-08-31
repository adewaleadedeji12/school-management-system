import { eq, and, sql } from 'drizzle-orm';
import { BaseRepository } from './base.repository';
import { attendance } from '../models/attendance.model';
import { db } from '../config/database.config';

export class AttendanceRepository extends BaseRepository {
  constructor() {
    super(attendance);
  }

  async findByStudentAndDate(studentId: string, date: Date) {
    const result = await db
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.studentId, studentId),
          eq(attendance.date, date)
        )
      )
      .limit(1);

    return result[0] || null;
  }

  async findByClassAndDate(classId: string, date: Date) {
    const result = await db
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.classId, classId),
          eq(attendance.date, date)
        )
      );

    return result;
  }

  async getAttendanceSummary(studentId: string) {
    const result = await db
      .select({
        status: attendance.status,
        count: sql<number>`count(*)::int`,
      })
      .from(attendance)
      .where(eq(attendance.studentId, studentId))
      .groupBy(attendance.status);

    return result;
  }
}