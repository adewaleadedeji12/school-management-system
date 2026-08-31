import { eq, and } from 'drizzle-orm';
import { BaseRepository } from './base.repository';
import { classes } from '../models/class.model';
import { db } from '../config/database.config';

export class ClassRepository extends BaseRepository {
  constructor() {
    super(classes);
  }

  async findByCode(code: string) {
    const result = await db
      .select()
      .from(classes)
      .where(eq(classes.code, code))
      .limit(1);

    return result[0] || null;
  }

  async findByAcademicYear(academicYear: string) {
    const result = await db
      .select()
      .from(classes)
      .where(eq(classes.academicYear, academicYear));

    return result;
  }
}