"use client";

import { useState } from "react";
import {
  Assignment,
  AssignmentTurnedIn,
  Info,
  Settings,
} from "@mui/icons-material";
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";

export default function BottomNav() {
  const [value, setValue] = useState(0);

  return (
    <Box>
      <Paper elevation={3} square={true}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_e, newValue) => setValue(newValue)}
        >
          <BottomNavigationAction
            label="My Tasks"
            icon={<Assignment />}
            value={0}
          />
          <BottomNavigationAction
            label="Completed"
            icon={<AssignmentTurnedIn />}
            value={1}
          />

          <BottomNavigationAction
            label="Settings"
            icon={<Settings />}
            value={2}
          />

          <BottomNavigationAction label="About" icon={<Info />} value={3} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
