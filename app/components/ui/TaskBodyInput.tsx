"use client";

import Quill from "quill";
import { useEffect, useRef } from "react";
import { Box, Collapse, SxProps } from "@mui/material";

import "quill/dist/quill.snow.css";

// BUG:
// Can't apply styles to text previously added

// TODO:
// 1) Sanity check
// 2) Write documentation

interface TaskInputBodyProps {
  disabled: boolean;
  onChange?: (html: string) => void;
  placeholder?: string;
  sx?: SxProps;
  value?: string;
}

export default function TaskBodyInput({
  disabled,
  onChange,
  placeholder,
  sx,
  value = "",
}: TaskInputBodyProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const isInternalUpdate = useRef(false);
  const onChangeRef = useRef(onChange);
  const disabledRef = useRef(disabled);

  useEffect(() => {
    onChangeRef.current = onChange;
    disabledRef.current = disabled;
  }, [onChange, disabled]);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: "#quill-toolbar",
        },
        placeholder: disabled ? " " : placeholder,
        readOnly: disabled,
      });

      if (value && quillRef.current) {
        quillRef.current.root.innerHTML = value;
      }

      // Auto-resize function - wrapped in setTimeout to ensure Quill is ready
      const resize = () => {
        const editor = quillRef.current?.root as HTMLElement;
        if (editor) {
          editor.style.height = "auto";
          editor.style.height = `${editor.scrollHeight}px`;
        }
      };

      // Initialize Quill
      quillRef.current.on("text-change", () => {
        if (
          quillRef.current &&
          !isInternalUpdate.current &&
          !disabledRef.current
        ) {
          onChangeRef.current?.(quillRef.current.root.innerHTML);
        }
        resize();
      });

      // Initial resize - delay to ensure DOM is ready
      setTimeout(resize, 0);
    }
  });

  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!disabled);
    }
  }, [disabled]);

  useEffect(() => {
    // Handle external value changes
    if (quillRef.current && quillRef.current.root.innerHTML !== value) {
      isInternalUpdate.current = true;
      quillRef.current.root.innerHTML = value;
      isInternalUpdate.current = false;

      // Trigger resize after value change
      const editor = quillRef.current.root as HTMLElement;
      editor.style.height = "auto";
      editor.style.height = `${editor.scrollHeight}px`;
    }
  }, [value]);

  return (
    <>
      <Box
        sx={{
          display: disabled ? "none" : "block",
        }}
      >
        <Box id="quill-toolbar" sx={{ backgroundColor: "#fafafa" }}>
          <Collapse in={!disabled}>
            <select className="ql-header" defaultValue="">
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option value="">Normal</option>
            </select>
            <button className="ql-bold" />
            <button className="ql-italic" />
            <button className="ql-underline" />
            <button className="ql-strike" />
            <button className="ql-list" value="ordered" />
            <button className="ql-list" value="bullet" />
            {/* <button className="ql-image" /> */}
          </Collapse>
        </Box>
      </Box>

      <Box
        sx={{
          minHeight: "5rem", // Minimum height to keep Collapse happy
          position: "relative",
        }}
      >
        <Box
          component="div"
          ref={editorRef}
          // Directly style Quill text editor.
          style={{ border: "none", fontSize: "1rem", overflowY: "hidden" }}
          // Apply CSS-in-JS styles.
          sx={{
            ...sx,
            "& .ql-tooltip": {
              display: "none",
            },
          }}
        />
      </Box>
    </>
  );
}
