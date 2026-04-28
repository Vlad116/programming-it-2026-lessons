import fs from "fs/promises";
import { createProject } from "./db.js";
import { DATA_FILE } from "./constants.js";

const fileData = await fs.readFile(DATA_FILE, "utf-8");
const projects = JSON.parse(fileData);

console.log("init db data");

for (const p of projects) {
  const created = createProject(p);
  console.log(`✓ ${created.title}`);
}

console.log("db data initialized");
