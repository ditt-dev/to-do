"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SyntheticEvent } from "react";
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

import { type AppView } from "@/app/config";

// TODO:
// 1) Write documentation

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentView = (searchParams.get("view") as AppView) || "tasks";

  const handleUpdateParams = (_e: SyntheticEvent, newView: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("view", newView);

    // Update URL
    router.replace(`${pathname}?${params}`, { scroll: false });
  };

  return (
    <Box>
      <Paper elevation={3} square={true}>
        <BottomNavigation
          onChange={handleUpdateParams}
          showLabels
          value={currentView}
        >
          <BottomNavigationAction
            label="My Tasks"
            icon={<Assignment />}
            value="tasks"
          />
          <BottomNavigationAction
            label="Completed"
            icon={<AssignmentTurnedIn />}
            value="completed"
          />
          <BottomNavigationAction
            label="Settings"
            icon={<Settings />}
            value="settings"
          />
          <BottomNavigationAction label="About" icon={<Info />} value="about" />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
