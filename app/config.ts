import { Breakpoint, createTheme } from "@mui/material";

// TODO:
// 1) Write documentation

const theme = createTheme();

const calcGutterWidth = (mult: number = 1) => {
  return { xs: theme.spacing(2 * mult), sm: theme.spacing(3 * mult) };
};

export const GUTTER_WIDTH = calcGutterWidth();
export const GUTTER_WIDTH_2X = calcGutterWidth(2);
export const MAX_WIDTH: Breakpoint = "md";
export const TASK_SPACING: string = theme.spacing(1.5);
