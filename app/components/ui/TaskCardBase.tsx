"use client";

import { ReactNode } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Divider,
  SxProps,
  TextareaAutosize,
} from "@mui/material";

// TODO:
// documentation

interface TaskCardBaseProps {
  bodyText: string;
  dataTaskId?: number;
  footAction: ReactNode;
  headAction?: ReactNode;
  isEditable: boolean;
  isExpanded: boolean; // This controls the Collapse
  onBodyChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  ref?: React.Ref<HTMLDivElement>;
  sx?: SxProps;
  titleText: string;
}

export default function TaskCardBase({
  bodyText,
  dataTaskId,
  footAction,
  headAction,
  isEditable,
  isExpanded,
  onBodyChange,
  onTitleChange,
  ref,
  sx,
  titleText,
}: TaskCardBaseProps) {
  // Style card text inputs.
  const inputStyles = {
    backgroundColor: "transparent",
    border: "none",
    cursor: isEditable ? "text" : "grab",
    outline: "none",
    padding: "0.5rem",
    width: "100%",
  };

  return (
    <Card data-task-id={dataTaskId} ref={ref} variant="outlined" sx={{ ...sx }}>
      <CardHeader
        // Display expand button.
        action={headAction}
        // Display task title.
        title={
          <input
            disabled={!isEditable}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter task name..."
            type="text"
            value={titleText}
            style={{ ...inputStyles, fontSize: "1.5rem" }}
          />
        }
      />

      <Divider />

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <CardContent>
          {/* Display task details */}
          <TextareaAutosize
            disabled={!isEditable}
            minRows={2}
            onChange={(e) => onBodyChange(e.target.value)}
            placeholder="Enter task description..."
            value={bodyText}
            style={{
              ...inputStyles,
              resize: "none",
            }}
          />
        </CardContent>

        {/* Display card foot action buttons. */}
        <CardActions>{footAction}</CardActions>
      </Collapse>
    </Card>
  );
}
