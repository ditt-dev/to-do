import { useState } from "react";
import { Box, Stack } from "@mui/material";

import Task from "app/components/ui/Task";
import { getTasks, type TTask } from "app/components/ui/task-data";
import { taskSpacing } from "@/app/config";
import { useDropMonitor } from "@/app/hooks/useDropMonitor";

export function List() {
  const [tasks, setTasks] = useState<TTask[]>(() => getTasks());

  useDropMonitor({ tasks, setTasks });

  // TODO: Comment cleanup, write documentation

  return (
    // Background containers
    <Box
      sx={{
        marginX: "auto",
        width: "420px",
        borderRadius: "0.25rem",
        borderWidth: "1px",
        borderStyle: "solid",
        padding: "0.5rem",
      }}
    >
      <Stack spacing={`${taskSpacing}px`}>
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
      </Stack>
    </Box>
  );
}
