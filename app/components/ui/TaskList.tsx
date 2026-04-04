"use client";

import { useState, useEffect, useCallback } from "react";
import { Container, Stack, Divider } from "@mui/material";

import CreateTask from "@/app/components/ui/CreateTask";
import Task from "@/app/components/ui/Task";
import { useDragAndDropMonitor } from "@/app/hooks/useDragAndDropMonitor";
import { getAllTasks } from "@/app/lib/indexedDB";
import { type TTask } from "@/app/lib/taskData";

// TODO:
// Implement real MUI loading component
// Documentation

export default function TaskList() {
  const [data, setData] = useState<TTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandID, setExpandID] = useState<number | null>(null);

  const handleExpand = (id: number) => setExpandID(expandID === id ? null : id);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getAllTasks();
      setData(res);
    } catch (error) {
      console.error("Error reading from database:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Enable drag and drop functionality;
  useDragAndDropMonitor({ tasks: data, setTasks: setData });

  if (loading) {
    return <Container>Loading...</Container>;
  }

  return (
    <Container>
      <Stack gap={1}>
        {data.map((task) => (
          <Task
            key={task.id}
            task={task}
            expandID={expandID}
            onExpand={handleExpand}
            onAction={fetchData}
          />
        ))}
      </Stack>

      <Divider sx={{ margin: "3rem 0", backgroundColor: "red" }} />

      <CreateTask onAction={fetchData} />
    </Container>
  );
}
