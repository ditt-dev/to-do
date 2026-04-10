import { Box, Container, Paper } from "@mui/material";

import BottomNav from "@/app/components/ui/BottomNav";
import TaskList from "@/app/components/ui/TaskList";

import CompletedList from "@/app/components/ui/CompletedList";
import SettingsPanel from "@/app/components/ui/SettingsPanel";
import AboutPanel from "@/app/components/ui/AboutPanel";
import {
  GUTTER_WIDTH,
  MAX_WIDTH,
  MIN_HEIGHT,
  type AppView,
} from "@/app/config";

// TODO:
// 1) Check all sx attributes for unnecessary template literals
// 2) Update all handlers with synthetic event parameter
// 3)Write documentation

interface HomeProps {
  searchParams: Promise<{ view?: AppView }>;
}
export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  function renderContent() {
    switch (params.view) {
      case "tasks":
        return <TaskList />;
      case "completed":
        return <CompletedList />;
      case "settings":
        return <SettingsPanel />;
      case "about":
        return <AboutPanel />;
      default:
        return <TaskList />;
    }
  }

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
        {/* Display main content. */}
        <Box
          component="main"
          id="content-wrapper"
          sx={{
            // Push bottom navigation to the bottom of the parent container.
            flexGrow: 1,
            paddingX: GUTTER_WIDTH,
          }}
        >
          {/* Display header. */}
          {/* <Box component="header">
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
          </Box> */}

          {renderContent()}
        </Box>

        {/* Display bottom navigation. */}
        <Box component="nav">
          <BottomNav />
        </Box>
      </Paper>
    </Container>
  );
}
