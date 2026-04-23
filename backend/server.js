import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import {
  readProjects,
  writeProjects,
  validateRequestBody,
} from "./utils/index.js";
import { PORT } from "./constants.js";

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
  },
  apis: ["./server.js"],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

    let projects = await readProjects();

    if (search && search.trim().length >= 3) {
      const q = search.trim().toLowerCase();

      projects = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }

    if (category !== "all") {
      projects = projects.filter((p) => p.category === category);
    }

    const total = projects.length;
    const start = (pageNum - 1) * limitNum;
    const end = start + limitNum;
    const paginated = projects.slice(start, end);

    res.set("X-Total-Count", String(total));

    res.json({
      projects: paginated,
      page: pageNum,
      limit: limitNum,
      total,
    });
  } catch (error) {
    console.error("Ошибка при получении проектов:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/projects/:id", async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);

    const projects = await readProjects();
    const project = projects.find((p) => p.id === projectId);

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
app.post("/api/projects", async (req, res) => {
  try {
    const {
      title,
      description,
      image = "",
      category = "Other",
      year,
      tags = [],
    } = req.body;

    validateRequestBody(req.body, requiredProjectFields);

    let projects = await readProjects();
    const maxId = projects.reduce((max, p) => Math.max(max, p.id), 0);

    const newProject = {
      id: maxId + 1,
      title: title.trim(),
      description: description.trim(),
      image,
      category,
      year: year ?? new Date().getFullYear(),
      tags: Array.isArray(tags) ? tags : [],
    };

    projects.push(newProject);

    await writeProjects(projects);

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
app.put("/api/projects/:id", async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    let projects = await readProjects();
    const indexInProjects = projects.findIndex((p) => p.id === projectId);

    if (indexInProjects === -1) {
      return res.status(404).json({ error: `Проект ${projectId} не найден` });
    }

    validateRequestBody(req.body, requiredProjectFields);

    const updatedProject = { ...projects[indexInProjects], ...req.body };

    projects[indexInProjects] = updatedProject;

    await writeProjects(projects);

    res.json({
      success: true,
      message: `Проект ${projectId} успешно обновлен`,
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
app.delete("/api/projects/:id", async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const projects = await readProjects();
    const indexInProjects = projects.findIndex((p) => p.id === projectId);

    if (indexInProjects === -1) {
      return res.status(404).json({ error: `Проект ${projectId} не найден` });
    }

    const [deleted] = projects.splice(indexInProjects, 1);

    await writeProjects(projects);

    res.json({
      success: true,
      message: `Проект ${deleted.title} успешно удалён`,
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
