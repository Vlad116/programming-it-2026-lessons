import fs from "fs/promises";
import { INIT_DATA_FILE } from "../constants.js";

async function readProjects() {
  const fileData = await fs.readFile(INIT_DATA_FILE, "utf-8");
  return JSON.parse(fileData);
}

async function writeProjects(projects) {
  await fs.writeFile(
    INIT_DATA_FILE,
    JSON.stringify(projects, null, 2),
    "utf-8",
  );
}

export { readProjects, writeProjects };
