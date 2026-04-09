import { Box, Container, Paper, Typography } from "@mui/material";

import BottomNav from "@/app/components/ui/BottomNav";
import TaskList from "@/app/components/ui/TaskList";
import { GUTTER_WIDTH, MAX_WIDTH, MIN_HEIGHT } from "@/app/config";

// BUG:
// Internal scrolling-- need to remove overflow: hidden

// TODO:
// Check all sx attributes for unnecessary template literals
// Documentation

export default function Home() {
  return (
    <Container
      disableGutters
      id="app-wrapper"
      maxWidth={MAX_WIDTH}
      sx={{
        display: "flex",
        height: MIN_HEIGHT,
        marginY: GUTTER_WIDTH,
        position: "relative",
      }}
    >
      <Paper
        elevation={3}
        square={false}
        sx={{
          display: "flex",
          flexDirection: "column",

          // Round NavBar corners.
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Box
          id="content-wrapper"
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            minHeight: 0,
            overflow: "hidden",
            paddingX: GUTTER_WIDTH,
          }}
        >
          {/* Display header. */}
          <Box component="header">
            <Typography
              variant="h2"
              sx={{
                marginBottom: "2rem",
                marginTop: "3.5rem",
                textAlign: "center",
              }}
            >
              Task manager
            </Typography>
          </Box>

          {/* Display task data. */}
          <Box
            component="main"
            sx={{ flexGrow: 1, minHeight: 0, overflow: "auto" }}
          >
            <TaskList />
          </Box>
        </Box>

        {/* Display bottom navigation. */}
        <Box component="nav">
          <BottomNav />
        </Box>
      </Paper>
    </Container>
  );
}
