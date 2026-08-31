import { eq, and } from 'drizzle-orm';
import { BaseRepository } from './base.repository';
import { exams } from '../models/exam.model';
import { db } from '../config/database.config';

export class ExamRepository extends BaseRepository {
  constructor() {
    super(exams);
  }

  async findByClassId(classId: string) {
    const result = await db
      .select()
      .from(exams)
      .where(eq(exams.classId, classId));

    return result;
  }

  async findBySubjectId(subjectId: string) {
    const result = await db
      .select()
      .from(exams)
      .where(eq(exams.subjectId, subjectId));

    return result;
  }
}