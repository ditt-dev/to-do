import { openDB } from "idb";
import type { Task } from "./taskData";

// TODO:
// documentation

// Configure database constants.
const DB_NAME = "TaskDB";
const DB_VERSION = 1;
const STORE_NAME = "tasks";

async function initDB() {
  return await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore(STORE_NAME, {
        autoIncrement: true,
        keyPath: "id",
      });

      // Create index on order for efficient sorting
      store.createIndex("index", "index");
    },
  });
}

export async function writeDB(data: Omit<Task, "id" | "index">) {
  const db = await initDB();
  const tasks = await db.getAll(STORE_NAME);

  // Append index value for drag and drop reordering.
  const newTask = {
    ...data,
    index: tasks.length,
  };

  return await db.add(STORE_NAME, newTask);
}

// Get all tasks from database ordered by their index.
export async function readDB() {
  const db = await initDB();
  const tasks = await db.getAll(STORE_NAME);

  return tasks.sort((a, b) => a.index - b.index);
}

// Update task order after drag and drop
export async function updateTaskOrder(reorderedTasks: Task[]) {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);

  reorderedTasks.forEach((task, i) => {
    task.index = i;
    store.put(task);
  });

  await transaction.done;
}
