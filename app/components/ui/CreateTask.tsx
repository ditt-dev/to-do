"use client";

import { useState } from "react";
import { Box, Button, Stack, Zoom } from "@mui/material";

import TaskCardBase from "@/app/components/ui/TaskCardBase";
import { createNewTask } from "@/app/lib/indexedDB";

// BUG:
// Allows new tasks to be created without a title

// TODO:
// Documentation

interface CreateTaskProps {
  onAction?: () => void;
}
export default function CreateTask({ onAction }: CreateTaskProps) {
  const [bodyText, setBodyText] = useState<string>("");
  const [titleText, setTitleText] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleBodyText = (value: string) => setBodyText(value);
  const handleTitleText = (value: string) => setTitleText(value);
  const handleVisibility = () => setIsVisible(!isVisible);

  // Cancel new task creation.
  const handleCancel = () => {
    setBodyText("");
    setTitleText("");
    setIsVisible(false);
  };

  // Add new task object to the database.
  const handleSave = async () => {
    try {
      await createNewTask({
        title: titleText,
        body: bodyText,
        createdOn: new Date().toISOString(),
      });

      if (onAction) onAction();

      // Reset fields
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
      >
        + Add task
      </Button>

      {/* The Box wrapper allows the zoom animation to work with custom component children */}
      <Zoom in={isVisible}>
        <Box>
          <TaskCardBase
            bodyText={bodyText}
            // Display Cancel and Save buttons in the card foot.
            footAction={
              <>
                <Button
                  color="error"
                  onClick={handleCancel}
                  variant="contained"
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} variant="contained">
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
