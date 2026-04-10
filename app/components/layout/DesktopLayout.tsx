import { ReactNode } from "react";
import { Container, Paper, Box } from "@mui/material";

import { GUTTER_WIDTH, MAX_WIDTH, MIN_HEIGHT } from "@/app/config";
// import AppHeader from "./AppHeader";

// TODO:
// 1) Figure out header situation (one header or one for each view?)
// 2) Write documentation

interface AppShellProps {
  content: ReactNode;
  navigation: ReactNode;
}
export default function DesktopLayout({ content, navigation }: AppShellProps) {
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
        {/* <AppHeader /> */}
        {/* Display main content. */}
        <Box
          id="content-wrapper"
          sx={{
            // Push bottom navigation to the bottom of the parent container.
            flexGrow: 1,
            paddingX: GUTTER_WIDTH,
          }}
        >
          {/* Display main content. */}
          <Box component="main">{content}</Box>
        </Box>

        {/* Display bottom navigation. */}
        <Box component="nav">{navigation}</Box>
      </Paper>
    </Container>
  );
}

//    <Box component="header">
//             <Typography
//               variant="h2"
//               sx={{
//                 marginBottom: "2rem",
//                 marginTop: "3.5rem",
//                 textAlign: "center",
//               }}
//             >
//               Task manager
//             </Typography>
//           </Box>
