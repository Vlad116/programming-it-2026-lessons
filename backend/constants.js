import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const PORT = 4000;
export const DATA_FILE = path.join(__dirname, "projects.json");
