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

export async function readDB() {
  const db = await initDB();
  const tasks = await db.getAll(STORE_NAME);

  return tasks.sort((a, b) => a.index - b.index);
}

// Update task order after drag and drop
export async function updateTaskOrder(orderedTaskIds: number[]) {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);

  // Update each task's order based on its position in the array
  for (let i = 0; i < orderedTaskIds.length; i++) {
    const taskId = orderedTaskIds[i];
    const task = await store.get(taskId);

    if (task) {
      task.index = i;
      await store.put(task);
    }
  }

  await transaction.done;
}
