import { DatabaseSync } from "node:sqlite";
import { DB_FILE_PATH } from "../constants.js";

const db = new DatabaseSync(DB_FILE_PATH);

db.exec(`
  PRAGMA journal_mode = WAL; 
  PRAGMA foreign_keys = ON;
`);

db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      email      TEXT NOT NULL UNIQUE,
      password   TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
`);

export function createUser(email, password) {
  db.exec("BEGIN");

  const query = `SELECT * FROM users WHERE email = '${email}'`;

  try {
    const stmt = db.prepare(
      "INSERT INTO users (email, password) VALUES (?, ?)",
    );
    const { lastInsertRowid } = stmt.run(email, password);
    db.exec("COMMIT");

    return db
      .prepare("SELECT id, email, created_at FROM users WHERE id = ?")
      .get(lastInsertRowid);
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}

export function findUserByEmail(email) {
  return db.prepare("SELECT * FROM users WHERE email = ?").get(email);
}
