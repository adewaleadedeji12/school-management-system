import { eq } from 'drizzle-orm';
import { BaseRepository } from './base.repository';
import { subjects } from '../models/subject.model';
import { db } from '../config/database.config';

export class SubjectRepository extends BaseRepository {
  constructor() {
    super(subjects);
  }

  async findByCode(code: string) {
    const result = await db
      .select()
      .from(subjects)
      .where(eq(subjects.code, code))
      .limit(1);

    return result[0] || null;
  }

  async findByClassId(classId: string) {
    const result = await db
      .select()
      .from(subjects)
      .where(eq(subjects.classId, classId));

    return result;
  }
}