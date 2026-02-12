import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import { Box } from "@mui/material";

import { taskSpacing } from "@/app/config";

// TODO: write documentation

/**
 * Creates a border between elements to indicate the drop location.
 * @param param0
 * @returns
 */

export default function DropIndicator({ edge }: { edge: Edge }) {
  const lineColor = "royalblue"; // Original: #1447e6

  // Define line properties in pixels.
  const lineThickness = 2;
  const ornamentSize = 8;

  const lineOffset = (taskSpacing + lineThickness) / -2;
  const ornamentOffset = (lineThickness - ornamentSize) / 2;

  return (
    <Box
      sx={{
        backgroundColor: lineColor,
        pointerEvents: "none",
        position: "absolute",
        zIndex: 10,

        // Apply edge styles.
        ...((edge === "bottom" || edge === "top") && {
          [edge]: `${lineOffset}px`,
          height: `${lineThickness}px`,
          left: `${ornamentSize / 2}px`,
          right: 0,
        }),
        // ...((edge === "left" || edge === "right") && {
        //   [edge]: lineOffset,
        //   bottom: 0,
        //   top: `${ornamentSize / 2}px`,
        //   width: `${lineThickness}px`,
        // }),

        // Apply ornament styles.
        "&::before": {
          border: `${lineThickness}px solid ${lineColor}`,
          borderRadius: "50%",
          boxSizing: "border-box",
          content: "''",
          height: `${ornamentSize}px`,
          position: "absolute",
          width: `${ornamentSize}px`,

          ...((edge === "bottom" || edge === "top") && {
            [edge]: `${ornamentOffset}px`,
            left: `-${ornamentSize}px`,
          }),
          // ...((edge === "left" || edge === "right") && {
          //   [edge]: `${ornamentOffset}px`,
          //   top: `-${ornamentSize}px`,
          // }),
        },
      }}
    />
  );
}
