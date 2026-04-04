import { useRef } from "react";
import { MoreVert } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";

import { DragPreview } from "@/app/components/ui/DragPreview";
import DropIndicator from "@/app/components/ui/DropIndicator";
import TaskCardBase from "@/app/components/ui/TaskCardBase";
import { useDragAndDropState } from "@/app/hooks/useDragAndDropState";
import { deleteTask } from "@/app/lib/indexedDB";
import { type Task } from "@/app/lib/taskData";

// TODO:
// Implement "edit" functionality
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

  // Delete task object from the database.
  const handleDelete = async (id: number) => {
    await deleteTask(id);

    // Update parent component after deletion and animation
    if (onAction) onAction();
  };

  // const [isEditing, setIsEditing] = useState<boolean>(false);
  // const [editedTitle, setEditedTitle] = useState<string>(task.title);
  // const [editedBody, setEditedBody] = useState<string>(task.body);

  // Edit existing task object.
  const handleEdit = () => {
    // TO BE IMPLEMENTED
    return;
  };

  return (
    <Box style={{ position: "relative" }}>
      <TaskCardBase
        bodyText={task.body}
        // Identify object for the DaD flash animation.
        dataTaskId={task.id}
        // Display Edit and Delete buttons in the card foot.
        footAction={
          <>
            <Button onClick={handleEdit} variant="contained">
              Edit
            </Button>
            <Button
              color="error"
              onClick={() => handleDelete(task.id)}
              variant="contained"
            >
              Delete
            </Button>
          </>
        }
        // Display button to expand the task.
        headAction={
          <IconButton onClick={() => onExpand(task.id)}>
            <MoreVert />
          </IconButton>
        }
        onBodyChange={handleEdit}
        onTitleChange={handleEdit}
        isEditable={
          // isEditing
          false
        }
        isExpanded={expandID === task.id}
        ref={ref}
        titleText={task.title}
        sx={{
          cursor: "grab",
          opacity: dragState.type === "is-dragging" ? 0.25 : 1,
        }}
      />

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
