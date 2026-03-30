"use client";

// import Task from "app/components/ui/OLD_Task";
// import { List } from "app/components/ui/List";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Container,
  IconButton,
  Stack,
  // TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";

import { MoreVert } from "@mui/icons-material";

// TODO:
// Save tasks to localStorage
// Add editable textArea in Collapse (needs separate userInput state)
// Separate components into their own files
// Revise JSDoc

/**
 * Represents a task item in the task list
 */
interface TaskItem {
  /** Unique identifier for the task */
  id: number;
  /** The text content of the task */
  value: string;
}

/**
 * Home component - Main task manager application
 *
 * Manages a list of tasks with capabilities to add, edit, delete,
 * and expand tasks to view additional content.
 *
 * @returns {JSX.Element} The rendered task manager interface
 */
export default function Home() {
  // return (
  //   <div>
  //     <List />
  //   </div>
  // );

  const [userInput, setUserInput] = useState<string>("");
  const [list, setList] = useState<TaskItem[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null); // Track index of item to edit

  const [timestamp, setTimestamp] = useState<string>("");

  /**
   * Updates the user input state with the provided value
   *
   * @param {string} value - The new input value from the text field
   */
  const updateInput = (value: string) => {
    setUserInput(value);
  };

  /**
   * Handles adding a new task or updating an existing one
   *
   * If in edit mode (editIndex not null), updates the existing task.
   * Otherwise, creates a new task with a random ID and adds it to the list.
   * Clears the input field and updates the timestamp after the action.
   */
  const handleAction = () => {
    if (userInput.trim() === "") return; // Avoid adding empty items

    if (editIndex !== null) {
      // Edit existing item
      const updatedList = list.map((item, index) =>
        index === editIndex ? { ...item, value: userInput } : item,
      );
      setList(updatedList);
      setEditIndex(null); // Reset edit mode
    } else {
      // Add new item
      const newItem: TaskItem = {
        id: Math.random(), // Consider using a more reliable ID generator
        value: userInput,
      };
      setList([...list, newItem]);
    }

    setTimestamp(
      new Date().toLocaleString("en-US", {
        day: "numeric",
        hour: "numeric",
        hour12: true,
        minute: "2-digit",
        month: "long",
        year: "numeric",
      }),
    );

    setUserInput(""); // Clear input field
  };

  /**
   * Deletes a task from the list by its ID
   *
   * @param {number} id - The unique identifier of the task to delete
   */
  const deleteItem = (id: number) => {
    const updatedList = list.filter((item) => item.id !== id);
    setList(updatedList);
  };

  /**
   * Enables edit mode for a specific task
   *
   * Populates the input field with the task's current value and
   * sets the edit index to the position of the task being edited.
   *
   * @param {number} index - The index position of the task to edit
   */
  const startEdit = (index: number) => {
    setUserInput(list[index].value);
    setEditIndex(index); // Set the index of the item to be edited
  };

  const [expandID, setExpandID] = useState<number | null>(null);

  /**
   * Toggles the expanded/collapsed state of a task card
   *
   * If the provided ID matches the currently expanded ID, collapses it.
   * Otherwise, expands the task with the provided ID.
   *
   * @param {number} id - The unique identifier of the task to expand or collapse
   */
  const handleExpand = (id: number) => setExpandID(expandID === id ? null : id);

  return (
    <Container maxWidth="sm">
      <Typography
        variant="h2"
        style={{
          textAlign: "center",
        }}
      >
        Task manager
      </Typography>

      {/* Display task creation text field. */}
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
        }}
      >
        <TextField
          sx={{
            flexGrow: "1",
          }}
          placeholder={editIndex !== null ? "Edit item..." : "Add item..."}
          value={userInput}
          onChange={(e) => updateInput(e.target.value)}
          variant="outlined"
        />
        <Button
          onClick={handleAction}
          variant="contained"
          sx={{ marginLeft: "1rem" }}
        >
          {editIndex === null ? "Add" : "Update"}
        </Button>
      </Box>

      <Stack spacing={1} sx={{ background: "#f9f9f9" }}>
        {list.length > 0 ? (
          list.map((item, index) => (
            <Card
              key={item.id} // Use the unique id as the key
              variant="outlined"
            >
              <CardHeader
                action={
                  <IconButton onClick={() => handleExpand(item.id)}>
                    <MoreVert />
                  </IconButton>
                }
                title={item.value}
                subheader={timestamp}
                sx={{
                  "& .MuiCardHeader-content": {
                    // minWidth: 0, // Important for flex children to shrink below content size
                    overflow: "hidden",
                  },
                  "& .MuiCardHeader-title": {
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                }}
              />
              <Collapse in={expandID === item.id} timeout="auto" unmountOnExit>
                <CardContent>
                  <p>hello</p>
                </CardContent>

                <CardActions>
                  <span>
                    <button
                      style={{
                        padding: "10px",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        marginRight: "10px",
                        cursor: "pointer",
                      }}
                      onClick={() => deleteItem(item.id)}
                    >
                      Delete
                    </button>
                    <button
                      style={{
                        padding: "10px",
                        backgroundColor: "#2196f3",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => startEdit(index)}
                    >
                      Edit
                    </button>
                  </span>
                </CardActions>
              </Collapse>
            </Card>
          ))
        ) : (
          <Card
            variant="outlined"
            // style={{ textAlign: "center", fontSize: "1.2rem", color: "#777" }}
          >
            <CardHeader title="No items in the list" />
          </Card>
        )}
      </Stack>
    </Container>
  );
}
