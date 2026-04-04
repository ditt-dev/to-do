import { useEffect, useState } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  extractClosestEdge,
  type Edge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

import { handleDragPreview } from "@/app/components/ui/DragPreview";
import { getNewTaskData, isTaskData, type TTask } from "@/app/lib/taskData";

// TODO:
// Is getNewTaskData getter function necessary?
// documentation

type TaskState =
  | { type: "idle" }
  | { type: "is-dragging" }
  | { type: "is-dragging-over"; closestEdge: Edge | null }
  | { type: "preview"; container: HTMLElement };

const idle: TaskState = { type: "idle" };

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
      draggable({
        element,
        getInitialData() {
          return getNewTaskData(task);
        },
        onDragStart() {
          setState({ type: "is-dragging" });
        },
        onDrop() {
          setState(idle);
        },
        onGenerateDragPreview({ nativeSetDragImage }) {
          handleDragPreview({ nativeSetDragImage, setState });
        },
      }),

      dropTargetForElements({
        element,
        canDrop({ source }) {
          if (source.element === element) {
            return false;
          }
          return isTaskData(source.data);
        },
        getData({ input }) {
          const data = getNewTaskData(task);
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ["top", "bottom"],
          });
        },
        getIsSticky() {
          return true;
        },
        onDrag({ self }) {
          const closestEdge = extractClosestEdge(self.data);
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
