import { Container, Typography } from "@mui/material";

import TaskList from "@/app/components/ui/TaskList";

// TODO:
// Export header, etc. to a layout component
// Documentation

export default function Home() {
  return (
    <Container maxWidth="sm">
      <Typography
        variant="h2"
        style={{
          textAlign: "center",
        }}
      >
        Task manager
      </Typography>

      <TaskList />
    </Container>
  );
}
