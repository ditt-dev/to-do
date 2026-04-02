import { openDB } from "idb";
import type { Task } from "./taskData";

// TODO:
// documentation

// Configure database constants.
const DB_NAME = "TaskDB";
const DB_VERSION = 1;
const STORE_NAME = "tasks";

// Query the existing or create a new database.
async function initDB() {
  return await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore(STORE_NAME, {
        autoIncrement: true,
        keyPath: "id",
      });

      store.createIndex("id", "id");
    },
  });
}

// Write function. The id value is automatically appended and incremented by initDB()
export async function writeDB(data: Omit<Task, "id">) {
  const db = await initDB();

  return await db.add(STORE_NAME, data);
}

// Read function - get articles by ID order
export async function readDB() {
  const db = await initDB();

  return await db.getAllFromIndex(STORE_NAME, "id");
}

// Read function - get single article by ID
export async function getArticleById(id: number) {
  const db = await initDB();

  return await db.get(STORE_NAME, id);
}
