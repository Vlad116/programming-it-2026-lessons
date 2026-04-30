import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import { PORT } from "./constants.js";
import { swaggerSpec } from "./swaggerSpec.js";
import { internalErrorHandler } from "./middleware/index.js";
import { authRouter, projectsRouter } from "./routers/index.js";

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRouter);
app.use("/api/projects", projectsRouter);
app.use(internalErrorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});
