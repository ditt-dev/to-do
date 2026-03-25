import { useEffect, useState } from "react";
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
  getTaskData,
  isTaskData,
  type TTask,
} from "@/app/components/ui/task-data";
import { handleDragPreview } from "@/app/components/ui/DragPreview";

// TODO: Separate useEffect functions for clarity
// TODO: General code parsing and cleanup

export type TaskState =
  | { type: "idle" }
  | { type: "is-dragging" }
  | { type: "is-dragging-over"; closestEdge: Edge | null }
  | { type: "preview"; container: HTMLElement };

export const idle: TaskState = { type: "idle" };

interface DaDStateProps {
  task: TTask;
  elementRef: React.RefObject<HTMLDivElement | null>;
}

export function useDragAndDropState({ task, elementRef }: DaDStateProps) {
  const [state, setState] = useState<TaskState>(idle);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

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
        onGenerateDragPreview({ nativeSetDragImage }) {
          handleDragPreview({ nativeSetDragImage, setState });
        },
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
  }, [task, elementRef]);

  return state;
}
