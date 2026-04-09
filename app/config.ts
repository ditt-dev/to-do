import { Breakpoint, createTheme } from "@mui/material";

// TODO:
// 1) Write documentation

const theme = createTheme();

export const appWidth: Breakpoint = "md";
export const taskSpacing: number = parseInt(theme.spacing(1), 10);
