import { Box, Container, Paper, Typography } from "@mui/material";

import BottomNav from "@/app/components/ui/BottomNav";
import TaskList from "@/app/components/ui/TaskList";
import { GUTTER_WIDTH, MAX_WIDTH, MIN_HEIGHT } from "@/app/config";

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
        marginY: GUTTER_WIDTH,
        minHeight: MIN_HEIGHT,
      }}
    >
      <Paper
        elevation={3}
        square={false}
        sx={{
          display: "flex",
          flexDirection: "column",
          // Hide bottom navigation's box shadow.
          overflow: "hidden",
          width: "100%",
        }}
      >
        <Box
          id="content-wrapper"
          sx={{
            // Push bottom navigation to the bottom of the parent container.
            flexGrow: 1,
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
          <Box component="main">
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
