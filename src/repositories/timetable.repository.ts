import { eq, and } from 'drizzle-orm';
import { BaseRepository } from './base.repository';
import { timetable } from '../models/timetable.model';
import { db } from '../config/database.config';

export class TimetableRepository extends BaseRepository {
  constructor() {
    super(timetable);
  }

  async findByClassAndDay(classId: string, dayOfWeek: string) {
    const result = await db
      .select()
      .from(timetable)
      .where(
        and(
          eq(timetable.classId, classId),
          eq(timetable.dayOfWeek, dayOfWeek)
        )
      )
      .orderBy(timetable.startTime);

    return result;
  }

  async findByTeacherId(teacherId: string) {
    const result = await db
      .select()
      .from(timetable)
      .where(eq(timetable.teacherId, teacherId));

    return result;
  }
}