import type { TStatus } from "app/components/ui/task-data";

import Box from "@mui/material/Box";

const bgColor: { [Key in TStatus]: string } = {
  todo: "#ddd6ff ",
  "in-progress": "#fee685",
  done: "#b9f8cf",
};

const label: { [Key in TStatus]: string } = {
  todo: "TODO",
  "in-progress": "In progress",
  done: "Done",
};

export function Status({ status }: { status: TStatus }) {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", width: "100px" }}>
      <Box
        sx={{
          backgroundColor: `${bgColor[status]}`,
          padding: "0.25rem",
          borderRadius: "0.25rem",
          fontSize: "0.75rem",
          lineHeight: "1rem",
          fontWeight: 600,
          textTransform: "uppercase",
          color: "#0f172b",
        }}
      >
        {label[status]}
      </Box>
    </Box>
  );
}
