import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

import invariant from "tiny-invariant";

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

// TODO: investigate "invariant" import
// TODO: The component passes down a hardcoded "gap" attribute. Find a way for the indicator to calculate its position without that
// TODO: General code parsing and cleanup

type TaskState =
  | {
      type: "idle";
    }
  | {
      type: "preview";
      container: HTMLElement;
    }
  | {
      type: "is-dragging";
    }
  | {
      type: "is-dragging-over";
      closestEdge: Edge | null;
    };

const idle: TaskState = { type: "idle" };

export function Task({ task }: { task: TTask }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<TaskState>(idle);

  useEffect(() => {
    const element = ref.current;
    invariant(element);
    return combine(
      draggable({
        element,
        getInitialData() {
          return getTaskData(task);
        },
        onGenerateDragPreview({ nativeSetDragImage }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: pointerOutsideOfPreview({
              x: "16px",
              y: "8px",
            }),
            render({ container }) {
              setState({ type: "preview", container });
            },
          });
        },
        onDragStart() {
          setState({ type: "is-dragging" });
        },
        onDrop() {
          setState(idle);
        },
      }),
      dropTargetForElements({
        element,
        canDrop({ source }) {
          // not allowing dropping on yourself
          if (source.element === element) {
            return false;
          }
          // only allowing tasks to be dropped on me
          return isTaskData(source.data);
        },
        getData({ input }) {
          const data = getTaskData(task);
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ["top", "bottom"],
          });
        },
        getIsSticky() {
          return true;
        },
        onDragEnter({ self }) {
          const closestEdge = extractClosestEdge(self.data);
          setState({ type: "is-dragging-over", closestEdge });
        },
        onDrag({ self }) {
          const closestEdge = extractClosestEdge(self.data);

          // Only need to update react state if nothing has changed.
          // Prevents re-rendering.
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
            gap: "8px",
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
      {state.type === "preview"
        ? createPortal(<DragPreview task={task} />, state.container)
        : null}
    </>
  );
}

// A simplified version of our task for the user to drag around
function DragPreview({ task }: { task: TTask }) {
  return (
    <Box
      sx={{
        padding: "0.5rem",
        borderRadius: "0.25rem",
        borderStyle: "solid",
        backgroundColor: "#ffffff",
      }}
    >
      {task.content}
    </Box>
  );
}
