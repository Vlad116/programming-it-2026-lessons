import swaggerJsdoc from "swagger-jsdoc";
import { PORT } from "./constants.js";

const requiredProjectFields = ["title", "description", "year"];

export const swaggerSpec = swaggerJsdoc({
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
  apis: ["./routers/*.js"],
});
