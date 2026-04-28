import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import { requireAuth } from "./middleware/auth.js";
import { validateRequestBody } from "./utils/index.js";
import { PORT, JWT_SECRET, JWT_EXPIRES } from "./constants.js";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  findUserByEmail,
  createUser,
} from "./db.js";

const requiredProjectFields = ["title", "description", "year"];

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Portfolio Projects API",
      version: "1.0.0",
      description: "CRUD API для управления проектами",
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Project: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            title: { type: "string", example: "Мой проект" },
            description: { type: "string", example: "Описание" },
            image: {
              type: "string",
              example: "https://picsum.photos/id/1/600/400",
            },
            category: { type: "string", example: "E-commerce" },
            year: { type: "integer", example: 2025 },
            tags: {
              type: "array",
              items: { type: "string" },
              example: ["React", "Node"],
            },
          },
        },
        ProjectRequestBody: {
          type: "object",
          required: requiredProjectFields,
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            image: { type: "string" },
            category: { type: "string" },
            year: { type: "integer" },
            tags: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./server.js"],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return req.json({ error: "email и password обязательны!" });
    }

    const existing = findUserByEmail(email);

    if (existing) {
      return req
        .status(400)
        .json({ error: "Данный Email уже зарегистрирован" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = createUser(email, hashed);
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES,
    });

    res.status(201).json({ success: true, token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = findUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ error: "Данный email не зарегистрирован!" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Неверный пароль!" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES,
    });

    res.json({
      success: true,
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/projects", async (req, res) => {
  try {
    const {
      search = "",
      page = "1",
      limit = "10",
      category = "all",
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const data = getProjects({
      search,
      category,
      page: pageNum,
      limit: limitNum,
    });

    res.set("X-Total-Count", String(data.total));
    res.json(data);
  } catch (error) {
    console.error("Ошибка при получении проектов:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/projects/:id", requireAuth, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);

    const project = getProjectById(projectId);

    if (!project)
      return res.status(404).json({ error: `Проект с id: ${id} не найден` });

    res.json(project);
  } catch (error) {
    console.error(`Ошибка при получении проекта:`, error);
    res.status(500).json({ error: `Internal server error` });
  }
});

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
app.post("/api/projects", requireAuth, async (req, res) => {
  try {
    const { title } = req.body;

    validateRequestBody(req.body, requiredProjectFields);

    const newProject = createProject(req.body);

    res.status(201).json({
      success: true,
      message: `Проект ${title.trim()} успешно записан`,
      project: newProject,
    });
  } catch (error) {
    console.error(`Ошибка при получении проекта:`, error);
    res.status(500).json({ error: `Internal server error` });
  }
});

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
app.put("/api/projects/:id", requireAuth, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);

    validateRequestBody(req.body, requiredProjectFields);

    const updatedProject = updateProject(projectId, req.body);

    if (!updatedProject) {
      return res.status(404).json({ error: `Проект '${projectId}' не найден` });
    }

    res.json({
      success: true,
      message: `Проект '${projectId}' успешно обновлен`,
      project: updatedProject,
    });
  } catch (error) {
    console.error(`Ошибка при получении проекта:`, error);
    res.status(500).json({ error: `Internal server error` });
  }
});

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
app.delete("/api/projects/:id", requireAuth, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const deleted = deleteProject(projectId);

    if (!deleted) {
      return res.status(404).json({ error: `Проект '${projectId}' не найден` });
    }

    res.json({
      success: true,
      message: `Проект '${deleted.title}' успешно удалён`,
      deletedId: deleted.id,
    });
  } catch (error) {
    console.error(`Ошибка при получении проекта:`, error);
    res.status(500).json({ error: `Internal server error` });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});
