"use client";

import { useRef, useState } from "react";
import { MoreVert } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";

import { DragPreview } from "@/app/components/ui/DragPreview";
import DropIndicator from "@/app/components/ui/DropIndicator";
import TaskCardBase from "@/app/components/ui/TaskCardBase";
import useDragAndDropState from "@/app/hooks/useDragAndDropState";
import { type TTask } from "@/app/lib/taskData";

// TODO:
// Implement text field highlight or color change to indicate edit state
// 2) Clean up handlers, sanity check
// 3) Write documentation

interface TaskCardProps {
  expandID: number | null;
  onDelete: (id: number) => Promise<void>;
  onEdit: (task: TTask) => Promise<void>;
  onExpand: (id: number, isEditing: boolean) => void;
  task: TTask;
}
export default function Task({
  expandID,
  onDelete,
  onEdit,
  onExpand,
  task,
}: TaskCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const dragState = useDragAndDropState({ task, elementRef: ref });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [bodyText, setBodyText] = useState<string>(task.body);
  const [titleText, setTitleText] = useState<string>(task.title);

  const handleBodyText = (value: string) => setBodyText(value);
  const handleTitleText = (value: string) => setTitleText(value);

  const handleStartEdit = () => setIsEditing(true);

  const handleSubmitEdit = async () => {
    try {
      await onEdit({
        ...task,
        title: titleText,
        body: bodyText,
        editedOn: new Date().toISOString(),
      });

      setIsEditing(false);
    } catch (error) {
      handleCancel();
      console.error("Error saving to database:", error);
    } finally {
    }
  };

  const handleCancel = () => {
    setIsEditing(false);

    setBodyText(task.body);
    setTitleText(task.title);
  };

  const handleDelete = async () => {
    await onDelete(task.id);

    // if (confirm("Are you sure you want to delete this task?")) {
    //   await onDelete(task.id);
    // }
  };

  const footAction = isEditing ? (
    <>
      <Button onClick={handleSubmitEdit} variant="contained">
        Update
      </Button>
      <Button color="error" onClick={handleCancel} variant="contained">
        Cancel
      </Button>
    </>
  ) : (
    <>
      <Button onClick={handleStartEdit} variant="contained">
        Edit
      </Button>
      <Button color="error" onClick={handleDelete} variant="contained">
        Delete
      </Button>
    </>
  );

  return (
    // Box is wrapper for DropIndicator and DragPreview components
    <Box style={{ position: "relative" }}>
      <TaskCardBase
        bodyText={bodyText}
        dataTaskId={task.id}
        footAction={footAction}
        headAction={
          <IconButton onClick={() => onExpand(task.id, isEditing)}>
            <MoreVert />
          </IconButton>
        }
        onBodyChange={handleBodyText}
        onTitleChange={handleTitleText}
        isEditable={isEditing}
        isExpanded={expandID === task.id}
        ref={isEditing ? null : ref}
        titleText={titleText}
        sx={{
          opacity: dragState.type === "is-dragging" ? 0.25 : 1,
          // Vertically align headAction button to center.
          "& .MuiCardHeader-action": {
            alignSelf: "center",
          },
        }}
      />

      {dragState.type === "is-dragging-over" && dragState.closestEdge && (
        <DropIndicator edge={dragState.closestEdge} />
      )}

      {dragState.type === "preview" && (
        <DragPreview task={task} container={dragState.container} />
      )}
    </Box>
  );
}
