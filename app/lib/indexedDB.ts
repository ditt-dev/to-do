import { openDB } from "idb";
import type { TTask } from "./taskData";

// TODO:
// 1) Examine Omit<> logic: does it make sense to append id and index here instead of in the handler function in CreateTask?
// 2) Write documentation

// Configure database.
const DB_NAME = "TaskDB";
const DB_VERSION = 1;
const STORE_NAME = "tasks";

// Call the database
async function initDB() {
  return await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      const store = db.createObjectStore(STORE_NAME, {
        keyPath: "id",
      });

      // Create index on order for efficient sorting
      store.createIndex("index", "index");
    },
  });
}

// CRUD: create
export async function createNewTask(data: Omit<TTask, "id" | "index">) {
  const db = await initDB();
  const tasks = await db.getAll(STORE_NAME);

  // Calculate new indices from the highest existing value.
  const newIndex =
    tasks.reduce((max, task) => Math.max(max, task.index), -1) + 1;

  const newTask = {
    ...data,
    id: Date.now(),
    index: newIndex,
  };

  await db.add(STORE_NAME, newTask);

  return newTask;
}

// CRUD: read
export async function getAllTasks() {
  const db = await initDB();
  const tasks = await db.getAll(STORE_NAME);

  // Return tasks ordered by index so DaD changes persist.
  return tasks.sort((a, b) => a.index - b.index);
}

// CRUD: update
export async function editTask(data: TTask) {
  const db = await initDB();

  return await db.put(STORE_NAME, data);
}

// CRUD: delete
export async function deleteTask(id: number) {
  const db = await initDB();

  return await db.delete(STORE_NAME, id);
}

// -----------------------------

// Update task order (database indices) after drag and drop
export async function updateTaskIdx(reorderedTasks: TTask[]) {
  const db = await initDB();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);

  reorderedTasks.forEach((task, i) => {
    task.index = i;
    store.put(task);
  });

  await transaction.done;
}
