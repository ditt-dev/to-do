import { useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Collapse,
  IconButton,
  TextareaAutosize,
  Typography,
} from "@mui/material";

import { DragIndicator } from "@mui/icons-material";
import DropIndicator from "@/app/components/ui/DropIndicator";
import { useDragAndDropState } from "@/app/hooks/useDragAndDropState";
import { type TTask } from "./task-data";
// import { Status } from "./status";
// import { DragPreview } from "./DragPreview";

// TODO: Comment cleanup, write documentation

export default function Task({ task }: { task: TTask }) {
  const [collapseOpen, setCollapseOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const state = useDragAndDropState({ task, elementRef: ref });

  const handleCollapseOpen = () => setCollapseOpen(true);

  return (
    <>
      <Box sx={{ position: "relative" }}>
        {/* Task card */}
        <Card
          onClick={handleCollapseOpen}
          sx={{
            opacity: `${state.type === "is-dragging" && 0.75}`,
            "&:hover": {
              backgroundColor: "#f1f5f9",
              cursor: "grab",
            },
          }}
          // Adding data-attribute as a way to query for this for our post drop flash
          data-task-id={task.id}

          // TODO: reenable the ref to restore DaD functionality
          // ref={ref}
        >
          <Box id="title-container" sx={{ display: "flex" }}>
            <IconButton disableRipple sx={{ paddingLeft: 0 }}>
              <DragIndicator />
            </IconButton>

            <Typography
              sx={{
                alignContent: "center",
                // flexGrow: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              variant="h6"
            >
              {task.content}
            </Typography>
          </Box>

          <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
            <CardContent
              sx={{
                // Override .Mui-CardContent-root padding.
                "&:last-child": {
                  padding: "0.25rem 0.5rem 0",
                },
              }}
            >
              <TextareaAutosize
                minRows={4}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "#000",
                  outline: "none",
                  resize: "none",
                  width: "100%",
                }}
              />
            </CardContent>
          </Collapse>

          {/* Display task status. */}
          {/* <Status status={task.status} /> */}
        </Card>

        {/* Display drop indicator. */}
        {state.type === "is-dragging-over" && state.closestEdge ? (
          <DropIndicator edge={state.closestEdge} />
        ) : null}
      </Box>

      {/* Display hover preview text when dragging. */}
      {/* {state.type === "preview" && (
        <DragPreview task={task} container={state.container} />
      )} */}
    </>
  );
}
