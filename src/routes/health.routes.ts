import { Router, Request, Response } from 'express';
import { db } from '../config/database.config';
import { sql } from 'drizzle-orm';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 */
router.get('/', async (_req: Request, res: Response) => {
  let dbStatus = 'healthy';
  
  try {
    await db.execute(sql`SELECT 1`);
  } catch {
    dbStatus = 'unhealthy';
  }

  res.status(dbStatus === 'healthy' ? 200 : 503).json({
    status: dbStatus === 'healthy' ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    services: {
      database: dbStatus,
    },
  });
});

export default router;