"use client";
import { useState } from "react";
import { Task } from "@/lib/api";

export function SortableList({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault(); // Must prevent default to allow drop
    if (draggedId === targetId) return;

    const dragIndex = tasks.findIndex((t) => t.id === draggedId);
    const targetIndex = tasks.findIndex((t) => t.id === targetId);

    const newTasks = [...tasks];
    const [dragged] = newTasks.splice(dragIndex, 1);
    newTasks.splice(targetIndex, 0, dragged);
    setTasks(newTasks);
  };

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          draggable
          onDragStart={() => setDraggedId(task.id)}
          onDragOver={(e) => handleDragOver(e, task.id)}
          onDrop={() => setDraggedId(null)}
          className={`p-4 bg-white border rounded cursor-grab active:cursor-grabbing ${draggedId === task.id ? "opacity-50 border-dashed" : ""}`}
        >
          {task.title}
        </li>
      ))}
    </ul>
  );
}
