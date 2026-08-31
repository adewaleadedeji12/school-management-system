import 'express-async-errors';
import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { env } from './config/env.config';
import { httpLogger } from './middleware/logger.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { generalLimiter } from './middleware/rate-limit.middleware';
import { corsOptions } from './config/cors.config';
import routes from './routes';

const app: Application = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: env.NODE_ENV === 'production' ? undefined : false,
}));
app.use(cors(corsOptions));

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());

// Rate limiting
app.use(generalLimiter);

// Request logging
app.use(httpLogger);

// Request ID
app.use((req, _res, next) => {
  const requestId = req.headers['x-request-id'] || crypto.randomUUID();
  req.headers['x-request-id'] = requestId;
  next();
});

// Swagger Documentation
const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Management System API',
      version: '1.0.0',
      description: 'Comprehensive School Management System REST API',
      contact: {
        name: 'API Support',
        email: 'support@school.edu',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}${env.API_PREFIX}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'School Management API Docs',
}));
app.get('/api-docs.json', (_req, res) => res.json(swaggerDocs));

// API Routes
app.use(env.API_PREFIX, routes);

// Root route
app.get('/', (_req, res) => {
  res.json({
    message: 'School Management System API',
    version: '1.0.0',
    docs: '/api-docs',
    health: '/health',
  });
});

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;