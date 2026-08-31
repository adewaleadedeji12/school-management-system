import { eq, and, desc, asc, SQL, count } from 'drizzle-orm';
import { db } from '../config/database.config';
import { createChildLogger } from '../config/logger.config';

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export class BaseRepository {
  protected logger = createChildLogger(this.constructor.name);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(protected table: any) {}

  protected buildWhereClause(filters: Record<string, unknown>): SQL | undefined {
    const conditions: SQL[] = [];

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        const column = this.table[key];
        if (column) {
          conditions.push(eq(column, value as Parameters<typeof eq>[1]));
        }
      }
    }

    return conditions.length > 0 ? and(...conditions) : undefined;
  }

  protected buildOrderBy(sortBy?: string, sortOrder: 'asc' | 'desc' = 'desc'): SQL | undefined {
    if (!sortBy) return undefined;

    const column = this.table[sortBy];
    if (!column) return undefined;

    return sortOrder === 'asc' ? asc(column) : desc(column);
  }

  async findAll(options?: PaginationOptions & { filters?: Record<string, unknown> }) {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 20;
      const offset = (page - 1) * limit;

      const whereClause = options?.filters
        ? this.buildWhereClause(options.filters)
        : undefined;
      const orderClause = this.buildOrderBy(options?.sortBy, options?.sortOrder);

      const fromTable = db.select().from(this.table);
      const fromCount = db.select({ count: count() }).from(this.table);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let selectQuery: any = fromTable;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let countQuery: any = fromCount;

      if (whereClause) {
        selectQuery = selectQuery.where(whereClause);
        countQuery = countQuery.where(whereClause);
      }
      if (orderClause) {
        selectQuery = selectQuery.orderBy(orderClause);
      }

      selectQuery = selectQuery.limit(limit).offset(offset);

      const [items, totalResult] = (await Promise.all([
        selectQuery,
        countQuery,
      ])) as [Record<string, unknown>[], { count: number }[]];

      return {
        items,
        total: totalResult[0]?.count || 0,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error({ error }, 'Error in findAll');
      throw error;
    }
  }

  async findById(id: string): Promise<Record<string, unknown> | null> {
    try {
      const idColumn = this.table['id'];
      if (!idColumn) return null;

      const result = await db
        .select()
        .from(this.table)
        .where(eq(idColumn, id))
        .limit(1);

      const rows = result as Record<string, unknown>[];
      return rows[0] || null;
    } catch (error) {
      this.logger.error({ error, id }, 'Error in findById');
      throw error;
    }
  }

  async findOne(filters: Record<string, unknown>): Promise<Record<string, unknown> | null> {
    try {
      const whereClause = this.buildWhereClause(filters);
      if (!whereClause) return null;

      const result = await db
        .select()
        .from(this.table)
        .where(whereClause)
        .limit(1);

      const rows = result as Record<string, unknown>[];
      return rows[0] || null;
    } catch (error) {
      this.logger.error({ error, filters }, 'Error in findOne');
      throw error;
    }
  }

  async create(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await db
        .insert(this.table)
        .values(data)
        .returning();

      const rows = result as Record<string, unknown>[];
      this.logger.debug({ id: rows[0]?.id }, 'Record created');
      return rows[0];
    } catch (error) {
      this.logger.error({ error, data }, 'Error in create');
      throw error;
    }
  }

  async update(id: string, data: Record<string, unknown>): Promise<Record<string, unknown> | null> {
    try {
      const idColumn = this.table['id'];
      if (!idColumn) return null;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await db
        .update(this.table)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(idColumn, id))
        .returning();

      const rows = result as Record<string, unknown>[];
      this.logger.debug({ id }, 'Record updated');
      return rows[0] || null;
    } catch (error) {
      this.logger.error({ error, id, data }, 'Error in update');
      throw error;
    }
  }

  async delete(id: string): Promise<Record<string, unknown> | null> {
    try {
      const idColumn = this.table['id'];
      if (!idColumn) return null;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await db
        .delete(this.table)
        .where(eq(idColumn, id))
        .returning();

      const rows = result as Record<string, unknown>[];
      this.logger.debug({ id }, 'Record deleted');
      return rows[0] || null;
    } catch (error) {
      this.logger.error({ error, id }, 'Error in delete');
      throw error;
    }
  }

  async exists(filters: Record<string, unknown>): Promise<boolean> {
    const found = await this.findOne(filters);
    return found !== null;
  }

  async countRecords(filters?: Record<string, unknown>): Promise<number> {
    const whereClause = filters ? this.buildWhereClause(filters) : undefined;

    const base = db.select({ count: count() }).from(this.table);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = whereClause ? base.where(whereClause) : base;

    const result = (await query) as { count: number }[];
    return result[0]?.count || 0;
  }
}