import { Breakpoint, createTheme } from "@mui/material";

// TODO:
// 1) Write documentation

const theme = createTheme();

// Contains size data for media query breakpoints
type BreakpointObject = { [key in Breakpoint]?: string };

const calcGutterWidth = function (mult: number = 1): BreakpointObject {
  return { xs: theme.spacing(2 * mult), sm: theme.spacing(3 * mult) };
};

const calcVertMargins = function (obj: BreakpointObject): BreakpointObject {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, `calc(100dvh - 2 * ${v})`]),
  );
};

export const GUTTER_WIDTH: BreakpointObject = calcGutterWidth();
export const GUTTER_WIDTH_2X: BreakpointObject = calcGutterWidth(2);
export const MAX_WIDTH: Breakpoint = "md";
export const MIN_HEIGHT: BreakpointObject = calcVertMargins(GUTTER_WIDTH);
export const TASK_SPACING: string = theme.spacing(1.5);
