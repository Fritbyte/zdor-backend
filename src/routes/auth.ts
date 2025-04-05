import { Router, Request, Response } from 'express';
import { check } from 'express-validator';
import { AuthController } from '@src/controllers/AuthController';
import { validateRequest } from '@src/middleware/validate';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post(
  '/register',
  [
    check('username', 'Имя пользователя обязательно').notEmpty(),
    check('password', 'Пароль должен содержать минимум 6 символов').isLength({ min: 6 }),
    check('confirmPassword', 'Подтверждение пароля обязательно').notEmpty(),
  ],
  validateRequest,
  (req: Request, res: Response) => authController.register(req, res),
);
authRoutes.post(
  '/login',
  [
    check('username', 'Имя пользователя обязательно').notEmpty(),
    check('password', 'Пароль обязателен').notEmpty(),
  ],
  validateRequest,
  (req: Request, res: Response) => authController.login(req, res),
);
export default authRoutes;