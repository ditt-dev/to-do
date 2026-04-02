"use client";

import { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  Stack,
  TextareaAutosize,
  Zoom,
} from "@mui/material";

import { writeDB } from "@/app/lib/indexedDB";

// TODO:
// documentation

interface CreateTaskProps {
  onCreate?: () => void;
}
export default function CreateTask({ onCreate }: CreateTaskProps) {
  const [bodyText, setBodyText] = useState<string>("");
  const [titleText, setTitleText] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);

  const handleBodyText = (value: string) => setBodyText(value);
  const handleTitleText = (value: string) => setTitleText(value);
  const handleVisible = () => setVisible(!visible);
  const handleDelete = () => {
    setBodyText("");
    setTitleText("");
  };

  const handleSave = async () => {
    try {
      await writeDB({
        body: bodyText,
        title: titleText,
      });

      // Update parent component when a new task is added.
      if (onCreate) onCreate();

      // Reset form and close
      handleVisible();
      handleDelete();
    } catch (error) {
      console.error("Error saving to database:", error);
    }
  };

  return (
    <Stack gap={1} sx={{ alignItems: "center" }}>
      {/* Display "Add task" button. */}
      <Button disabled={visible} onClick={handleVisible} variant="contained">
        + Add task
      </Button>

      {/* Display new task template. */}
      <Zoom in={visible}>
        <Card variant="outlined">
          <CardHeader
            title={
              <input
                onChange={(event) => handleTitleText(event.target.value)}
                placeholder="New task name..."
                type="text"
                value={titleText}
                style={{
                  border: "none",
                  padding: "0.5rem",
                  fontSize: "1.5rem",
                  width: "100%",
                  outline: "none",
                }}
              />
            }
          />

          <Divider />

          <Collapse in={true} timeout="auto" unmountOnExit>
            <CardContent>
              <TextareaAutosize
                minRows={2}
                onChange={(event) => handleBodyText(event.target.value)}
                placeholder="Additional details..."
                value={bodyText}
                style={{
                  border: "none",
                  outline: "none",
                  padding: "0.5rem",
                  resize: "none",
                  width: "100%",
                }}
              ></TextareaAutosize>
            </CardContent>

            <CardActions>
              <Button
                color="error"
                onClick={() => {
                  handleVisible();
                  handleDelete();
                }}
                variant="contained"
              >
                Cancel
              </Button>

              <Button onClick={handleSave} variant="contained">
                Save
              </Button>
            </CardActions>
          </Collapse>
        </Card>
      </Zoom>
    </Stack>
  );
}
