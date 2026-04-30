import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/index.js";

export const projectsRouter = Router();

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Получить список проектов
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Поиск по названию и описанию (мин. 3 символа)
 *       - in: query
 *         name: category
 *         schema: { type: string, default: all }
 *         description: Фильтр по категории
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Список проектов с пагинацией
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 projects: { type: array, items: { $ref: '#/components/schemas/Project' } }
 *                 page:     { type: integer }
 *                 limit:    { type: integer }
 *                 total:    { type: integer }
 */
projectsRouter.get("/", getProjects);

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Получить проект по ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Проект найден
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Project' }
 *       404:
 *         description: Проект не найден
 */
projectsRouter.get("/:id", requireAuth, getProjectById);

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Создание нового проекта
 *     tags: [Projects]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema: { $ref: '#/components/schemas/ProjectRequestBody' }
 *     responses:
 *      201:
 *        description: Проект создан
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success: { type: boolean }
 *                message: { type: string }
 *                project: { type: '#/components/schemas/Project' }
 *      400:
 *        description: Не передано одно из обязательных полей
 */
projectsRouter.post("/", requireAuth, createProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Обновление данных проекта
 *     tags: [Projects]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema: { type: integer }
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema: { $ref: '#/components/schemas/ProjectRequestBody' }
 *     responses:
 *      200:
 *        description: Проект обновлен
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success: { type: boolean }
 *                message: { type: string }
 *                project: { type: '#/components/schemas/Project' }
 *      404:
 *        description: Проект не найден
 */
projectsRouter.put("/:id", requireAuth, updateProject);

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Удалить проект по id
 *     tags: [Projects]
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema: { type: integer }
 *     responses:
 *      200:
 *        description: Проект удалён
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success: { type: boolean }
 *                message: { type: string }
 *                deletedId: { type: number }
 *      404:
 *        description: Проект не найден
 */
projectsRouter.delete("/:id", requireAuth, deleteProject);

export default projectsRouter;
