"use client";

import { useState } from "react";
import { Box, Button, Stack, Zoom } from "@mui/material";

import TaskCardBase from "@/app/components/ui/TaskCardBase";
import { type TTask } from "@/app/lib/taskData";

// TODO:
// 1) Toggle top/bottom mode for when the button is under the list or above it
// 2) Wider button CSS
// 3) Write documentation

interface CreateTaskProps {
  onCreateTask: (taskData: Omit<TTask, "id" | "index">) => Promise<void>;
}
export default function CreateTask({ onCreateTask }: CreateTaskProps) {
  const [bodyText, setBodyText] = useState<string>("");
  const [titleText, setTitleText] = useState<string>("");
  const [isHidden, setIsHidden] = useState<boolean>(false);

  const handleBodyText = (value: string) => setBodyText(value);
  const handleTitleText = (value: string) => setTitleText(value);
  const handleVisibility = () => setIsHidden(!isHidden);

  const handleCancel = () => {
    setIsHidden(false);

    // Delay resetting the text while the zoom animation plays.
    setTimeout(() => {
      setBodyText("");
      setTitleText("");
    }, 500);
  };

  const handleSave = async () => {
    try {
      await onCreateTask({
        title: titleText,
        body: bodyText,
        createdOn: new Date().toISOString(),
      });

      handleCancel();
    } catch (error) {
      console.error("Error saving to database:", error);
    }
  };

  return (
    <Stack gap={1} sx={{ alignItems: "center" }}>
      <Button
        disabled={isHidden}
        onClick={handleVisibility}
        variant="contained"
      >
        + Add task
      </Button>

      <Zoom in={isHidden}>
        <Box>
          <TaskCardBase
            bodyText={bodyText}
            footAction={
              <>
                <Button
                  color="error"
                  onClick={handleCancel}
                  variant="contained"
                >
                  Cancel
                </Button>
                <Button
                  disabled={!titleText.trim()}
                  onClick={handleSave}
                  variant="contained"
                >
                  Save
                </Button>
              </>
            }
            isEditable={true}
            isExpanded={true}
            onBodyChange={handleBodyText}
            onTitleChange={handleTitleText}
            titleText={titleText}
          />
        </Box>
      </Zoom>
    </Stack>
  );
}
