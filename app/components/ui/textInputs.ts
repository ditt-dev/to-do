import { styled, TextareaAutosize } from "@mui/material";

// TODO:
// 1) Write documentation

const inputStyles = {
  backgroundColor: "transparent",
  border: "none",
  outline: "none",
  padding: "0.5rem",
  width: "100%",
};

export const StyledInput = styled("input")({
  ...inputStyles,
  fontSize: "1.5rem",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

export const StyledTextarea = styled(TextareaAutosize)({
  ...inputStyles,
  resize: "none",
});
