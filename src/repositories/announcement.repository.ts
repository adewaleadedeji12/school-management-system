import { eq, and } from 'drizzle-orm';
import { BaseRepository } from './base.repository';
import { announcements } from '../models/announcement.model';
import { db } from '../config/database.config';

export class AnnouncementRepository extends BaseRepository {
  constructor() {
    super(announcements);
  }

  async findPublished() {
    const result = await db
      .select()
      .from(announcements)
      .where(eq(announcements.isPublished, true))
      .orderBy(announcements.publishedAt);

    return result;
  }

  async findByType(type: string) {
    const result = await db
      .select()
      .from(announcements)
      .where(eq(announcements.type, type));

    return result;
  }
}