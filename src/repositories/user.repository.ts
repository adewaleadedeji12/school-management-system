import { eq, and, ilike, or, sql } from 'drizzle-orm';
import { BaseRepository } from './base.repository';
import { users } from '../models/user.model';
import { db } from '../config/database.config';

export class UserRepository extends BaseRepository {
  constructor() {
    super(users);
  }

  async findByEmail(email: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);
    
    return result[0] || null;
  }

  async findByRefreshToken(token: string) {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.refreshToken, token))
      .limit(1);
    
    return result[0] || null;
  }

  async findByPasswordResetToken(token: string) {
    const now = new Date();
    const result = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.passwordResetToken, token),
          sql`${users.passwordResetExpires} > ${now}`
        )
      )
      .limit(1);
    
    return result[0] || null;
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    const result = await db
      .update(users)
      .set({ refreshToken, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    
    return result[0] || null;
  }

  async updateLastLogin(userId: string) {
    const result = await db
      .update(users)
      .set({ lastLogin: new Date(), updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    
    return result[0] || null;
  }

  async incrementFailedAttempts(userId: string) {
    const user = await this.findById(userId);
    if (!user) return null;
    
    const attempts = parseInt(typeof user.failedLoginAttempts === 'string' ? user.failedLoginAttempts : '0') + 1;
    const lockUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;
    
    const result = await db
      .update(users)
      .set({
        failedLoginAttempts: attempts.toString(),
        lockUntil,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    return result[0] || null;
  }

  async resetFailedAttempts(userId: string) {
    const result = await db
      .update(users)
      .set({
        failedLoginAttempts: '0',
        lockUntil: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    return result[0] || null;
  }

  async setPasswordResetToken(userId: string, token: string, expiresAt: Date) {
    const result = await db
      .update(users)
      .set({
        passwordResetToken: token,
        passwordResetExpires: expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    return result[0] || null;
  }

  async clearPasswordResetToken(userId: string) {
    const result = await db
      .update(users)
      .set({
        passwordResetToken: null,
        passwordResetExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    return result[0] || null;
  }

  async updatePassword(userId: string, hashedPassword: string) {
    const result = await db
      .update(users)
      .set({
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    return result[0] || null;
  }

  async search(query: string, role?: string, page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    
    const conditions = [
      or(
        ilike(users.firstName, `%${query}%`),
        ilike(users.lastName, `%${query}%`),
        ilike(users.email, `%${query}%`),
      ),
    ];

    if (role) {
      conditions.push(eq(users.role, role as any));
    }

    const where = and(...conditions);

    const [items, totalResult] = await Promise.all([
      db
        .select()
        .from(users)
        .where(where)
        .orderBy(users.createdAt)
        .limit(limit)
        .offset(offset),
      db.select({ count: sql<number>`count(*)` }).from(users).where(where),
    ]);

    return {
      items,
      total: totalResult[0]?.count || 0,
      page,
      limit,
    };
  }
}