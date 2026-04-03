// TODO:
// documentation, sanity check, cleanup

// New task data type for your structure
export interface Task {
  id: number;
  title: string;
  body: string;
  createdOn: string;
  index: number;
}

// Type guard for drag and drop validation
export function isTaskData(data: unknown): data is {
  id: number;
  title: string;
  body: string;
  createdOn: string;
  index: number;
} {
  return (
    typeof data === "object" &&
    data !== null &&
    ["id", "title", "body", "createdOn", "index"].every((key) => key in data)
  );
}

// Getter for draggable/droppable data
export function getNewTaskData(task: Task) {
  return {
    id: task.id,
    title: task.title,
    body: task.body,
    createdOn: task.createdOn,
    index: task.index,
  };
}
