import { eq, desc, sql } from 'drizzle-orm';
import { BaseRepository } from './base.repository';
import { auditLogs } from '../models/audit-log.model';
import { db } from '../config/database.config';

export class AuditLogRepository extends BaseRepository {
  constructor() {
    super(auditLogs);
  }

  async findByUserId(userId: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const [items, totalResult] = await Promise.all([
      db
        .select()
        .from(auditLogs)
        .where(eq(auditLogs.userId, userId))
        .orderBy(desc(auditLogs.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(auditLogs)
        .where(eq(auditLogs.userId, userId)),
    ]);

    return {
      items,
      total: totalResult[0]?.count || 0,
      page,
      limit,
    };
  }

  async findByAction(action: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;

    const [items, totalResult] = await Promise.all([
      db
        .select()
        .from(auditLogs)
        .where(eq(auditLogs.action, action))
        .orderBy(desc(auditLogs.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(auditLogs)
        .where(eq(auditLogs.action, action)),
    ]);

    return {
      items,
      total: totalResult[0]?.count || 0,
      page,
      limit,
    };
  }
}