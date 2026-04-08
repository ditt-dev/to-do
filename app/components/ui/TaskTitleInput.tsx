import { InputHTMLAttributes } from "react";
import { styled, SxProps } from "@mui/material";

// TODO:
// 1) Write documentation

interface TaskTitleInputProps extends InputHTMLAttributes<HTMLInputElement> {
  sx?: SxProps;
}
export default function TaskTitleInput(props: TaskTitleInputProps) {
  return <StyledInput {...props} />;
}

const StyledInput = styled("input")({
  backgroundColor: "transparent",
  border: "none",
  fontSize: "1.5rem",
  outline: "none",
  overflow: "hidden",
  padding: "0.5rem",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  width: "100%",
});
