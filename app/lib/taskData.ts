// TODO:
// documentation, sanity check, cleanup

// New task data type for your structure
export interface Task {
  id: number;
  title: string;
  body: string;
}

// Type guard for drag and drop validation
export function isTaskData(data: unknown): data is {
  id: number;
  title: string;
  body: string;
} {
  return (
    typeof data === "object" &&
    data !== null &&
    "id" in data &&
    "title" in data &&
    "body" in data
  );
}

// Getter for draggable/droppable data
export function getNewTaskData(task: Task) {
  return {
    id: task.id,
    title: task.title,
    body: task.body,
  };
}
