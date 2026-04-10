"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";
import {
  Card,
  CardActions,
  CardHeader,
  Collapse,
  Divider,
  SxProps,
} from "@mui/material";

import TaskTitleInput from "@/app/components/ui/TaskTitleInput";

// Allow quill library to query the document object.
const TaskBodyInput = dynamic(
  () => import("@/app/components/ui/TaskBodyInput"),
  {
    ssr: false,
  },
);

// TODO:
// 1) Remove Divider, find another solution for separating head and body (use an MUI component with elevation?)
// 2) Write documentation

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
  return (
    <Card
      // Used by DaD hook to play flashing animation on drop
      data-task-id={dataTaskId}
      ref={ref}
      variant="outlined"
      sx={{ ...sx }}
    >
      <CardHeader
        // Display expand button.
        action={headAction}
        // Display task title.
        title={
          <TaskTitleInput
            disabled={!isEditable}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Enter task name..."
            required
            type="text"
            value={titleText}
            sx={{
              cursor: isEditable ? "text" : "grab",
            }}
          />
        }
      />

      <Divider />

      <Collapse in={isExpanded} timeout="auto">
        <TaskBodyInput
          disabled={!isEditable}
          onChange={onBodyChange}
          placeholder="Enter task description..."
          value={bodyText}
          sx={{ cursor: isEditable ? "text" : "grab" }}
        />

        {/* Display card foot action buttons. */}
        <CardActions>{footAction}</CardActions>
      </Collapse>
    </Card>
  );
}
