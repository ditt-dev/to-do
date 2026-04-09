import { Breakpoint, createTheme } from "@mui/material";

// TODO:
// 1) Write documentation

const theme = createTheme();

export const GUTTER_WIDTH: { [key in Breakpoint]?: string } = {
  xs: theme.spacing(2),
  sm: theme.spacing(3),
};
export const MAX_WIDTH: Breakpoint = "md";
export const TASK_SPACING: string = theme.spacing(1.5);
