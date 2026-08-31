import app from './app';
import { env } from './config/env.config';
import { logger } from './config/logger.config';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📝 API Docs: http://localhost:${PORT}/api-docs`);
  logger.info(`🏥 Health: http://localhost:${PORT}/health`);
  logger.info(`🌍 Environment: ${env.NODE_ENV}`);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason: unknown) => {
  logger.error({ reason }, 'Unhandled Rejection');
});

process.on('uncaughtException', (error: Error) => {
  logger.error({ error }, 'Uncaught Exception');
  process.exit(1);
});