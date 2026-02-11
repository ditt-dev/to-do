import * as React from "react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import DragIndicator from "@mui/icons-material/DragIndicator";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import SimpleTextField from "app/components/ui/SimpleTextField";

// TODO: adjust icon padding for small mobile breakpoints

export default function Task() {
  const [expanded, setExpanded] = React.useState(false);
  const [taskDetails, setTaskDetails] = React.useState("");
  const [taskTitle, setTaskTitle] = React.useState("");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card>
      {/* Display card header. */}
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            width: "100%",
          }}
        >
          <IconButton
            sx={{
              display: `${expanded && "none"}`,
              padding: "1rem",
            }}
            aria-label="drag to reorder"
          >
            <DragIndicator />
          </IconButton>

          <SimpleTextField
            id="task-title"
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Add new task"
            slotProps={{
              input: {
                sx: { fontSize: "1.5rem", fontWeight: 500 },
              },
            }}
            value={taskTitle}
          />
        </Box>

        {/* Toggle collapse function. */}
        <IconButton
          onClick={handleExpandClick}
          sx={{
            padding: "1rem",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: (theme) =>
              theme.transitions.create("transform", {
                duration: theme.transitions.duration.shortest,
              }),
          }}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </Box>

      {/* Display card body. */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Divider />

        <SimpleTextField
          id="task-details"
          onChange={(e) => setTaskDetails(e.target.value)}
          placeholder="Edit task details..."
          value={taskDetails}
        />
      </Collapse>
    </Card>
  );
}
