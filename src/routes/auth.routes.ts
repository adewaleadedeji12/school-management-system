import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  refreshTokenSchema,
} from '../schemas/auth.schema';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter, passwordResetLimiter } from '../middleware/rate-limit.middleware';

const router = Router();
const controller = new AuthController();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, teacher, student, parent]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already exists
 */
router.post(
  '/register',
  authLimiter,
  validate({ body: registerSchema }),
  controller.register.bind(controller)
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post(
  '/login',
  authLimiter,
  validate({ body: loginSchema }),
  controller.login.bind(controller)
);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Reset email sent if email exists
 */
router.post(
  '/forgot-password',
  passwordResetLimiter,
  validate({ body: forgotPasswordSchema }),
  controller.forgotPassword.bind(controller)
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password reset successful
 */
router.post(
  '/reset-password',
  validate({ body: resetPasswordSchema }),
  controller.resetPassword.bind(controller)
);

router.post(
  '/change-password',
  authenticate,
  validate({ body: changePasswordSchema }),
  controller.changePassword.bind(controller)
);

router.post(
  '/refresh-token',
  validate({ body: refreshTokenSchema }),
  controller.refreshToken.bind(controller)
);

router.post('/logout', authenticate, controller.logout.bind(controller));

router.get('/verify-email', controller.verifyEmail.bind(controller));

router.get('/profile', authenticate, controller.getProfile.bind(controller));

router.put('/profile', authenticate, controller.updateProfile.bind(controller));

export default router;