"use client";

import {
  useState,
  useEffect,
  useCallback,
  useOptimistic,
  startTransition,
} from "react";
import { Container, Stack, Divider } from "@mui/material";

import CreateTask from "@/app/components/ui/CreateTask";
import Task from "@/app/components/ui/Task";
import { useDragAndDropMonitor } from "@/app/hooks/useDragAndDropMonitor";
import {
  getAllTasks,
  createNewTask,
  editTask,
  deleteTask,
} from "@/app/lib/indexedDB";
import { type TTask } from "@/app/lib/taskData";

// TODO:
// 1) Fix vertical scrollbar "jumpiness"

// 2) Update TTask[] array of objects to Map() ???
// const [tasksMap, setTasksMap] = useState(new Map());
// setTasksMap(prev => new Map(prev).set(updatedTask.id, updatedTask));

// 3) Implement proper MUI loading
// 4) Write documentation

export default function TaskList() {
  const [tasks, setTasks] = useState<TTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandID, setExpandID] = useState<number | null>(null);

  // Set up optimistic state
  const [, dispatchOptimistic] = useOptimistic(tasks);

  const handleExpand = (id: number) => setExpandID(expandID === id ? null : id);

  // Initial data fetch
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const tasks = await getAllTasks();

      setTasks(tasks);
    } catch (error) {
      console.error("Error reading from database:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateTask = async (taskData: Omit<TTask, "id" | "index">) => {
    try {
      await createNewTask(taskData);

      const tasks = await getAllTasks();

      setTasks(tasks);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleEditTask = async (updatedTask: TTask) => {
    // Optimistically update edited text.
    startTransition(async () => {
      dispatchOptimistic((allTasks) =>
        allTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task,
        ),
      );

      try {
        await editTask(updatedTask);

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task,
          ),
        );
      } catch (error) {
        console.error("Error editing task:", error);
        await fetchData();
      }
    });
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id);

      const tasks = await getAllTasks();

      setTasks(tasks);
    } catch (error) {
      console.error("Error deleting task:", error);
      await fetchData();
    }
  };

  // Enable drag and drop functionality;
  useDragAndDropMonitor({ tasks, setTasks });

  // TODO: MUI loading component
  if (loading) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <Stack gap={1}>
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            expandID={expandID}
            onExpand={handleExpand}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </Stack>

      <Divider sx={{ margin: "3rem 0", backgroundColor: "red" }} />

      <CreateTask onCreateTask={handleCreateTask} />
    </Container>
  );
}
