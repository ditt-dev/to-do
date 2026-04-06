"use client";

import { useRef, useState } from "react";
import { MoreVert } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";

import { DragPreview } from "@/app/components/ui/DragPreview";
import DropIndicator from "@/app/components/ui/DropIndicator";
import TaskCardBase from "@/app/components/ui/TaskCardBase";
import { useDragAndDropState } from "@/app/hooks/useDragAndDropState";
import { deleteTask, editTask } from "@/app/lib/indexedDB";
import { type TTask } from "@/app/lib/taskData";

// BUG:
// 1) ref={isEditing ?  null : ref} does not prevent DaD while isEditing = true

// FIXME:
// 1) It's possible to close a task, drag and drop, etc. with it still in edit mode. Toggling the task closed should turn off edit mode

// TODO:
// 1) CSS  to highlight fields when task is in edit mode
// 2) Write documentation

interface TaskCardProps {
  expandID: number | null;
  onAction?: () => void;
  onExpand: (id: number) => void;
  task: TTask;
}
export default function Task({
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

  // Control state to trigger edit function nodes and css
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [bodyText, setBodyText] = useState<string>(task.body);
  const [titleText, setTitleText] = useState<string>(task.title);

  const handleBodyText = (value: string) => setBodyText(value);
  const handleTitleText = (value: string) => setTitleText(value);

  // const [editedTitle, setEditedTitle] = useState<string>(task.title);
  // const [editedBody, setEditedBody] = useState<string>(task.body);

  // Edit existing task object.
  const handleStartEdit = () => setIsEditing(true);

  const handleSubmitEdit = async () => {
    try {
      await editTask({
        ...task,
        title: titleText,
        body: bodyText,
        editedOn: new Date().toISOString(),
      });

      if (onAction) onAction();
      setIsEditing(false);
    } catch (error) {
      handleCancel();

      console.error("Error saving to database:", error);
    }
  };

  // Reset text fields to defaults.
  const handleCancel = () => {
    // Close the card expansion on cancel
    // onExpand(NaN);

    setBodyText(task.body);
    setTitleText(task.title);
    setIsEditing(false);
  };

  const footAction =
    // Display Update and Cancel buttons during editing.
    isEditing ? (
      <>
        <Button onClick={handleSubmitEdit} variant="contained">
          Update
        </Button>
        <Button color="error" onClick={handleCancel} variant="contained">
          Cancel
        </Button>
      </>
    ) : (
      // Display Edit and Delete buttons.
      <>
        <Button onClick={handleStartEdit} variant="contained">
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
    );

  return (
    <Box style={{ position: "relative" }}>
      <TaskCardBase
        bodyText={bodyText}
        // Identify object for the DaD flash animation.
        dataTaskId={task.id}
        // Display Edit and Delete buttons in the card foot.
        footAction={footAction}
        // Display button to expand the task.
        headAction={
          <IconButton onClick={() => onExpand(task.id)}>
            <MoreVert />
          </IconButton>
        }
        onBodyChange={handleBodyText}
        onTitleChange={handleTitleText}
        isEditable={isEditing}
        isExpanded={expandID === task.id}
        // // Disable ref to prevent DaD during editing.
        ref={isEditing ? null : ref}
        titleText={titleText}
        sx={{
          cursor: isEditing ? "text" : "grab",
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
