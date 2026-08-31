import { eq, sql } from 'drizzle-orm';
import { BaseRepository } from './base.repository';
import { grades } from '../models/grade.model';
import { db } from '../config/database.config';

export class GradeRepository extends BaseRepository {
  constructor() {
    super(grades);
  }

  async findByStudentId(studentId: string) {
    const result = await db
      .select()
      .from(grades)
      .where(eq(grades.studentId, studentId));

    return result;
  }

  async findByExamId(examId: string) {
    const result = await db
      .select()
      .from(grades)
      .where(eq(grades.examId, examId));

    return result;
  }

  async calculateGPA(studentId: string): Promise<{ gpa: number; totalCount: number }> {
    const result = await db
      .select({
        count: sql<number>`count(*)::int`,
        totalPoints: sql<number>`COALESCE(SUM(${grades.gradePoint}), 0)::float`,
      })
      .from(grades)
      .where(eq(grades.studentId, studentId));

    const record = result[0];
    if (!record || record.count === 0) {
      return { gpa: 0, totalCount: 0 };
    }

    const gpa = record.totalPoints / record.count;
    return { gpa: Math.round(gpa * 100) / 100, totalCount: record.count };
  }
}