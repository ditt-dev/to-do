import { openDB } from "idb";
import type { Task } from "./taskData";

// TODO:
// documentation

// Configure database constants.
const DB_NAME = "TaskDB";
const DB_VERSION = 1;
const STORE_NAME = "tasks";

// Call the database
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

// Create new task
export async function createNewTask(data: Omit<Task, "id" | "index">) {
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
export async function getAllTasks() {
  const db = await initDB();
  const tasks = await db.getAll(STORE_NAME);

  return tasks.sort((a, b) => a.index - b.index);
}

// Update task order (database indices) after drag and drop
export async function updateTaskIdx(reorderedTasks: Task[]) {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);

  reorderedTasks.forEach((task, i) => {
    task.index = i;
    store.put(task);
  });

  await transaction.done;
}

// Delete tasks
export async function deleteTask(id: number) {
  const db = await initDB();

  return await db.delete(STORE_NAME, id);
}
