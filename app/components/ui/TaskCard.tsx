import { useRef } from "react";
import { MoreVert } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Collapse,
  Divider,
  IconButton,
} from "@mui/material";

import { DragPreview } from "@/app/components/ui/DragPreview";
import DropIndicator from "@/app/components/ui/DropIndicator";
import { useDragAndDropState } from "@/app/hooks/useDragAndDropState";
import { type Task } from "@/app/lib/taskData";

import { deleteTask } from "@/app/lib/indexedDB";

// TODO:
// Implement "edit" functionality
// Try to make this reusable so an "editable" version with text fields can be used in CreateTask
// documentation

interface TaskCardProps {
  expandID: number | null;
  onAction?: () => void;
  onExpand: (id: number) => void;
  task: Task;
}
export default function TaskCard({
  expandID,
  onAction,
  onExpand,
  task,
}: TaskCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const dragState = useDragAndDropState({ task, elementRef: ref });

  const handleDelete = async (id: number) => {
    await deleteTask(id);

    // Update parent component after deletion and animation
    if (onAction) onAction();
  };

  return (
    <Box style={{ position: "relative" }}>
      <Card
        // Allow element to be queried by DaD hooks.
        data-task-id={task.id}
        ref={ref}
        variant="outlined"
        sx={{
          opacity: dragState.type === "is-dragging" ? 0.25 : 1,
          cursor: "grab",
          "&:active": {
            cursor: "grabbing",
          },
        }}
      >
        <CardHeader
          action={
            <IconButton onClick={() => onExpand(task.id)}>
              <MoreVert />
            </IconButton>
          }
          title={task.title}
        />

        <Divider />

        <Collapse in={expandID === task.id} timeout="auto" unmountOnExit>
          <CardContent>{task.body}</CardContent>
          <CardActions>
            <Button disabled={true} variant="contained">
              Edit
            </Button>
            <Button
              color="error"
              onClick={() => handleDelete(task.id)}
              variant="contained"
            >
              Delete
            </Button>
          </CardActions>
        </Collapse>
      </Card>

      {/* Display drop indicator when dragging. */}
      {dragState.type === "is-dragging-over" && dragState.closestEdge && (
        <DropIndicator edge={dragState.closestEdge} />
      )}

      {/* Display hover preview text when dragging. */}
      {dragState.type === "preview" && (
        <DragPreview task={task} container={dragState.container} />
      )}
    </Box>
  );
}
