import { DatabaseSync } from "node:sqlite";
import { DB_FILE_PATH } from "../constants.js";

const db = new DatabaseSync(DB_FILE_PATH);

db.exec(`
  PRAGMA journal_mode = WAL; 
  PRAGMA foreign_keys = ON;
`); // journal_mode - не блокировать запись, foreign_keys - включить внешние ключи

db.exec(`
    CREATE TABLE IF NOT EXISTS projects(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title       TEXT    NOT NULL,
        description TEXT    NOT NULL DEFAULT '',
        image       TEXT    NOT NULL DEFAULT '',
        category    TEXT    NOT NULL DEFAULT 'Other',
        year        INTEGER NOT NULL DEFAULT (strftime('%Y','now')),
        created_at  TEXT    NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tags(
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        name       TEXT    NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_tags_project ON tags(project_id);
`);

// Helpers
/* Достаем теги для конкретного проекта и прикрепляем к объекту */
const getTagsForProject = db.prepare(
  "SELECT * FROM tags WHERE project_id = ? ORDER BY ID",
);

const attachTags = (project) => {
  const rows = getTagsForProject.all(project.id);

  return { ...project, tags: rows.map((r) => r.name) };
};

const insertTag = db.prepare(
  "INSERT INTO tags (project_id, name) VALUES (?, ?)",
);
const deleteTags = db.prepare("DELETE FROM tags WHERE project_id = ?");

// QUERIES
export function findProjects({
  search = "",
  category = "all",
  page = 1,
  limit = 10,
} = {}) {
  let query = "SELECT * FROM projects WHERE 1=1";
  const params = [];

  if (search.trim().length >= 3) {
    query += " AND (title LIKE ? OR description LIKE ?)";
    const q = `%${search.trim()}%`;
    params.push(q, q);
  }

  if (category !== "all") {
    query += " AND category = ?";

    params.push(category);
  }

  const total = db
    .prepare(`SELECT COUNT(*) as cnt FROM (${query})`)
    .get(...params).cnt;

  const projects = db
    .prepare(`${query} ORDER BY id DESC LIMIT ? OFFSET ?`)
    .all(...params, limit, (page - 1) * limit);

  return {
    projects: projects.map(attachTags),
    total,
    page,
    limit,
  };
}

export function findProjectById(id) {
  const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(id);
  return project ? attachTags(project) : null;
}

export const saveProject = (data) => {
  const {
    title,
    description = "",
    image = "",
    category = "Other",
    year,
    tags = [],
  } = data;
  const thisYear = new Date().getFullYear();

  db.exec("BEGIN");
  try {
    const stmt = db.prepare(
      `
        INSERT INTO projects (title, description, image, category, year)
        VALUES (?, ?, ?, ?, ?)
      `,
    );

    const result = stmt.run(
      title.trim(),
      description.trim(),
      image,
      category,
      year ?? thisYear,
    );

    const projectId = result.lastInsertRowid;

    for (const tag of tags) {
      insertTag.run(projectId, tag);
    }

    db.exec("COMMIT");
    return findProjectById(projectId);
  } catch (e) {
    db.exec("ROLLBACK");
    throw e;
  }
};

export const upsertProject = (id, data) => {
  const existing = findProjectById(id);

  if (!existing) return null;

  const {
    title = existing.title,
    description = existing.description,
    image = existing.image,
    category = existing.category,
    year = existing.year,
    tags,
  } = data;

  db.exec("BEGIN");

  try {
    db.prepare(
      `
      UPDATE projects
      SET title = ?,
          description = ?,
          image = ?,
          category = ?,
          year = ?
      WHERE id = ?
    `,
    ).run(title.trim(), description.trim(), image, category, year, id);

    if (Array.isArray(tags)) {
      deleteTags.run(id);

      for (const tag of tags) {
        insertTag.run(id, tag);
      }
    }

    db.exec("COMMIT");

    return findProjectById(id);
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
};

export const removeProject = (id, data) => {
  const project = findProjectById(id);

  if (!project) return null;

  db.exec("BEGIN");

  try {
    db.prepare("DELETE FROM projects WHERE id = ?").run(id);
    db.exec("COMMIT");
    return project;
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
};
