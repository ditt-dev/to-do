import * as React from "react";

import TextField, { TextFieldProps } from "@mui/material/TextField";

interface SimpleTextFieldProps extends Omit<TextFieldProps, "slotProps"> {
  slotProps?: TextFieldProps["slotProps"] & {
    input?: {
      sx?: React.CSSProperties;
    };
  };
}

const SimpleTextField: React.FC<SimpleTextFieldProps> = ({
  fullWidth = true,
  id,
  minRows = 1,
  onChange,
  placeholder,
  slotProps,
  value,
  variant = "filled",
  ...otherProps
}) => {
  return (
    <TextField
      fullWidth={fullWidth}
      id={id}
      minRows={minRows}
      onChange={onChange}
      placeholder={placeholder}
      slotProps={{ ...slotProps }}
      sx={{
        // Modify the default "filled" CSS.
        "& .MuiFilledInput-root": {
          backgroundColor: "transparent",
          "&:hover": { backgroundColor: "transparent" },
          "&.Mui-focused": { backgroundColor: "transparent" },

          // Remove border lines.
          "&:before, &:after": { display: "none" },
        },

        // Adjust padding to accommodate minRows={1}.
        "& .MuiFilledInput-input": { padding: "1rem" },

        ...otherProps.sx,
      }}
      value={value}
      variant={variant}
      {...otherProps}
    />
  );
};

export default SimpleTextField;
