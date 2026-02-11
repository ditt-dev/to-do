import type { Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/types";
import { Box } from "@mui/material";

// TODO: write documentation

/**
 * Creates a border between elements to indicate the drop location.
 * @param param0
 * @returns
 */

export default function DropIndicator({
  edge,
  gap,
}: {
  edge: Edge;
  gap: number;
}) {
  const lineColor = "royalblue"; // Original: #1447e6
  const lineThickness = 2;
  const ornamentSize = 8;

  const lineOffset = `${(gap + lineThickness) * -0.5}px`;
  const ornamentOffset = `${(lineThickness - ornamentSize) * 0.5}px`;

  return (
    <Box
      sx={{
        backgroundColor: lineColor,
        pointerEvents: "none",
        position: "absolute",
        zIndex: 10,

        // Apply edge styles.
        ...((edge === "bottom" || edge === "top") && {
          [edge]: lineOffset,
          height: `${lineThickness}px`,
          left: `${ornamentSize / 2}px`,
          right: 0,
        }),
        ...((edge === "left" || edge === "right") && {
          [edge]: lineOffset,
          bottom: 0,
          top: `${ornamentSize / 2}px`,
          width: `${lineThickness}px`,
        }),

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
            [edge]: ornamentOffset,
            left: `-${ornamentSize}px`,
          }),
          ...((edge === "left" || edge === "right") && {
            [edge]: ornamentOffset,
            top: `-${ornamentSize}px`,
          }),
        },
      }}
    />
  );
}
