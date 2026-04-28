import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const INIT_DATA_FILE = path.join(__dirname, "projects.json");
export const PORT = process.env.PORT ?? 4000;
export const DB_FILE_PATH = process.env.DB_FILE ?? "./projects.db";
export const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";
export const JWT_EXPIRES = process.env.JWT_EXPIRES ?? "7d";
