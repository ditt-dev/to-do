"use client";

import { useState, useEffect, useCallback } from "react";
import { Container, Stack, Divider } from "@mui/material";

import CreateTask from "@/app/components/ui/CreateTask";
import TaskCard from "@/app/components/ui/TaskCard";
import { useDragAndDropMonitor } from "@/app/hooks/useDragAndDropMonitor";
import { readDB } from "@/app/lib/indexedDB";
import { type Task } from "@/app/lib/taskData";

// TODO:
// Implement real MUI loading component
// Documentation

export default function TaskList() {
  const [data, setData] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandID, setExpandID] = useState<number | null>(null);

  const handleExpand = (id: number) => setExpandID(expandID === id ? null : id);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const res = await readDB();
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
          <TaskCard
            key={task.id}
            task={task}
            expandID={expandID}
            onExpand={handleExpand}
          />
        ))}
      </Stack>

      <Divider sx={{ margin: "3rem 0", backgroundColor: "red" }} />

      <CreateTask onCreate={fetchData} />
    </Container>
  );
}
