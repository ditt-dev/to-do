import { useEffect } from "react";
import { flushSync } from "react-dom";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { triggerPostMoveFlash } from "@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";

import { updateTaskOrder } from "@/app/lib/indexedDB";
import { isTaskData, type Task } from "@/app/lib/taskData";

// TODO:
// Documentation

interface DaDMonitorProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}
export function useDragAndDropMonitor({ tasks, setTasks }: DaDMonitorProps) {
  useEffect(() => {
    return monitorForElements({
      canMonitor({ source }) {
        return isTaskData(source.data);
      },

      onDrop({ location, source }) {
        const target = location.current.dropTargets[0];
        if (!target) return;

        const sourceData = source.data;
        const targetData = target.data;
        if (!isTaskData(sourceData) || !isTaskData(targetData)) return;

        const indexOfSource = tasks.findIndex(
          (task) => task.id === sourceData.id,
        );
        const indexOfTarget = tasks.findIndex(
          (task) => task.id === targetData.id,
        );
        if (indexOfTarget < 0 || indexOfSource < 0) return;

        const closestEdgeOfTarget = extractClosestEdge(targetData);
        const reorderedTasks = reorderWithEdge({
          list: tasks,
          startIndex: indexOfSource,
          indexOfTarget,
          closestEdgeOfTarget,
          axis: "vertical",
        });

        flushSync(() => {
          setTasks(reorderedTasks);
        });

        // Update the database with new task indices.
        updateTaskOrder(reorderedTasks);

        // Play flashing animation on moved element.
        const element = document.querySelector(
          `[data-task-id="${sourceData.id}"]`,
        );
        if (element instanceof HTMLElement) {
          triggerPostMoveFlash(element);
        }
      },
    });
  }, [tasks, setTasks]);
}
