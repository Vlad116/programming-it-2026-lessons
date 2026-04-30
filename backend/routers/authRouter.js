import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { register, login, getUserInfo } from "../controllers/index.js";

export const authRouter = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:    { type: string, example: user@example.com }
 *               password: { type: string, example: qwerty123 }
 *     responses:
 *       201:
 *         description: Пользователь создан, возвращает токен
 *       400:
 *         description: Email уже занят или не переданы поля
 */
authRouter.post("/register", register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Вход, получение JWT токена
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:    { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Успешный вход, возвращает токен
 *       401:
 *         description: Неверный email или пароль
 */
authRouter.post("/login", login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Текущий пользователь
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Данные пользователя }
 *       401: { description: Не авторизован }
 */
authRouter.get("/me", requireAuth, getUserInfo);

export default authRouter;
