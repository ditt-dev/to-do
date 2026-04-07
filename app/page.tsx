import { Container, Stack, Typography } from "@mui/material";

import TaskList from "@/app/components/ui/TaskList";

// TODO:
// Add MUI paper component for box shadow
// Check all sx attributes for unnecessary template literals
// Export header, etc. to a layout component
// Documentation

export default function Home() {
  return (
    <Container maxWidth="md">
      <Stack gap={4}>
        {/* Display header. */}
        <Typography
          variant="h2"
          style={{
            textAlign: "center",
          }}
        >
          Task manager
        </Typography>

        {/* Display main. */}
        <TaskList />
      </Stack>
    </Container>
  );
}
