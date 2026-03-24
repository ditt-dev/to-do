import { useEffect, useRef, useState } from "react";

import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

import {
  Box,
  Card,
  CardContent,
  Collapse,
  IconButton,
  Typography,
} from "@mui/material";
import { DragIndicator } from "@mui/icons-material";

import DropIndicator from "@/app/components/ui/DropIndicator";
import { getTaskData, isTaskData, type TTask } from "./task-data";
// import { Status } from "./status";

// import { DragPreview, handleDragPreview } from "./DragPreview";

// TODO: Separate useEffect functions for clarity
// TODO: General code parsing and cleanup

type TaskState =
  | { type: "idle" }
  | { type: "is-dragging" }
  | { type: "is-dragging-over"; closestEdge: Edge | null }
  | { type: "preview"; container: HTMLElement };

const idle: TaskState = { type: "idle" };

export function Task({ task }: { task: TTask }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<TaskState>(idle);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    return combine(
      // Function 1
      draggable({
        element,

        getInitialData() {
          return getTaskData(task);
        },

        onDragStart() {
          setState({ type: "is-dragging" });
        },
        onDrop() {
          setState(idle);
        },

        // Create a preview of the dragged element.
        // onGenerateDragPreview({ nativeSetDragImage }) {
        //   handleDragPreview({ nativeSetDragImage, setState });
        // },
      }),

      // Function 2
      dropTargetForElements({
        element,

        // Only allow dragged element to be dropped on other task data.
        canDrop({ source }) {
          // Prevent dragged element from dropping on itself.
          if (source.element === element) {
            return false;
          }
          return isTaskData(source.data);
        },

        // A function that returns data you want to attach to the drop target. getData() is called repeatedly while the user is dragging over the drop target in order to power addons
        getData({ input }) {
          const data = getTaskData(task);

          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ["top", "bottom"],
          });
        },

        // Return true if you want your drop target to hold onto selection after the user is no longer dragging over this drop target.
        getIsSticky() {
          return true;
        },

        onDrag({ self }) {
          const closestEdge = extractClosestEdge(self.data);

          // Update state only if nothing has changed to prevent re-rendering.
          setState((current) => {
            if (
              current.type === "is-dragging-over" &&
              current.closestEdge === closestEdge
            ) {
              return current;
            }
            return { type: "is-dragging-over", closestEdge };
          });
        },

        onDragEnter({ self }) {
          const closestEdge = extractClosestEdge(self.data);
          setState({ type: "is-dragging-over", closestEdge });
        },

        onDragLeave() {
          setState(idle);
        },

        onDrop() {
          setState(idle);
        },
      }),
    );
  }, [task]);

  // ------------------------------------------------------------
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <Box sx={{ position: "relative" }}>
        {/* Task card */}
        <Card
          onClick={handleExpandClick}
          sx={{
            // gap: "8px",
            // border: "1px solid red",
            opacity: `${state.type === "is-dragging" && 0.75}`,
            // padding: "0.5rem",
            "&:hover": {
              backgroundColor: "#f1f5f9",
              cursor: "grab",
            },
          }}
          // Adding data-attribute as a way to query for this for our post drop flash
          data-task-id={task.id}
          ref={ref}
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

          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography sx={{ marginBottom: 2 }}>Method:</Typography>
            </CardContent>
          </Collapse>

          {/* Display task status. */}
          {/* <Status status={task.status} /> */}
        </Card>

        {/* Display drag indicator. */}
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
