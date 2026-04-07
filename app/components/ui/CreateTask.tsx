"use client";

import { useState } from "react";
import { Box, Button, Stack, Zoom } from "@mui/material";

import TaskCardBase from "@/app/components/ui/TaskCardBase";
import { type TTask } from "@/app/lib/taskData";

// TODO:
// 1) Toggle top/bottom mode for when the button is under the list or above it
// 2) Improve button CSS (MUI icon?)
// 3) Improve textarea CSS
// 4) Write documentation

interface CreateTaskProps {
  onCreateTask: (taskData: Omit<TTask, "id" | "index">) => Promise<void>;
}
export default function CreateTask({ onCreateTask }: CreateTaskProps) {
  const [bodyText, setBodyText] = useState<string>("");
  const [titleText, setTitleText] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleBodyText = (value: string) => setBodyText(value);
  const handleTitleText = (value: string) => setTitleText(value);
  const handleVisibility = () => setIsVisible(!isVisible);

  const handleCancel = () => {
    setIsVisible(false);

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
        disabled={isVisible}
        onClick={handleVisibility}
        variant="contained"
        sx={{ fontSize: "1.25rem", textTransform: "none", width: "30%" }}
      >
        + New task
      </Button>

      <Zoom in={isVisible}>
        <Box sx={{ width: "100%" }}>
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
