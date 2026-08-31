import { eq, sql } from 'drizzle-orm';
import { BaseRepository } from './base.repository';
import { fees } from '../models/fee.model';
import { db } from '../config/database.config';

export class FeeRepository extends BaseRepository {
  constructor() {
    super(fees);
  }

  async findByStudentId(studentId: string) {
    const result = await db
      .select()
      .from(fees)
      .where(eq(fees.studentId, studentId));

    return result;
  }

  async findByStatus(status: string) {
    const result = await db
      .select()
      .from(fees)
      .where(eq(fees.status, status));

    return result;
  }

  async getFeeSummary() {
    const result = await db
      .select({
        status: fees.status,
        count: sql<number>`count(*)::int`,
        totalBalance: sql<number>`COALESCE(SUM(${fees.balance}), 0)::float`,
        totalPaid: sql<number>`COALESCE(SUM(${fees.amountPaid}), 0)::float`,
      })
      .from(fees)
      .groupBy(fees.status);

    return result;
  }
}