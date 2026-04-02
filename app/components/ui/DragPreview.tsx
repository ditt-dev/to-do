import { createPortal } from "react-dom";
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { Box } from "@mui/material";

import type { Task } from "@/app/lib/taskData";

// TODO
// write documentation
// Improve preview component styling

// Render preview of dragged element.
interface DragPreviewProps {
  container: HTMLElement;
  task: Task;
}
export function DragPreview({ container, task }: DragPreviewProps) {
  return createPortal(
    <Box
      sx={{
        backgroundColor: "#ffffff",
        color: "#000",
        borderRadius: "0.25rem",
        borderStyle: "solid",
        padding: "0.5rem",
      }}
    >
      {task.title}
    </Box>,
    container,
  );
}

// Render the container for the drag preview.
interface HandleDragPreviewProps {
  nativeSetDragImage:
    | null
    | ((image: HTMLElement, x: number, y: number) => void);

  setState: (state: { type: "preview"; container: HTMLElement }) => void;
}
export function handleDragPreview({
  nativeSetDragImage,
  setState,
}: HandleDragPreviewProps) {
  if (!nativeSetDragImage) return;

  setCustomNativeDragPreview({
    nativeSetDragImage,
    // Determine the preview's offset in pixels from the mouse cursor.
    getOffset: pointerOutsideOfPreview({
      x: "16px",
      y: "8px",
    }),

    render({ container }) {
      setState({ type: "preview", container });
    },
  });
}
