"use client";
import { useEffect, useState } from "react";
import { Task } from "@/lib/api";

export function SortableList({ initialTasks }: { initialTasks: Task[] }) {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const [tasks, setTasks] = useState(() => {
    // 1. Load order from localStorage on initial render
    if (typeof window !== "undefined") {
      const savedOrder = localStorage.getItem("taskOrder");
      if (savedOrder) {
        const orderIds = JSON.parse(savedOrder);
        return [...initialTasks].sort(
          (a, b) => orderIds.indexOf(a.id) - orderIds.indexOf(b.id),
        );
      }
    }
    return initialTasks;
  });

  useEffect(() => {
    const orderIds = tasks.map((t) => t.id);
    localStorage.setItem("taskOrder", JSON.stringify(orderIds));
  }, [tasks]);

  useEffect(() => {
    if (initialTasks.length !== tasks.length) {
      setTasks(initialTasks);
    }
  }, [initialTasks, tasks.length]);

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault(); // Must prevent default to allow drop
    if (draggedId === targetId) return;

    const dragIndex = tasks.findIndex((t) => t.id === draggedId);
    const targetIndex = tasks.findIndex((t) => t.id === targetId);

    const newTasks = [...tasks];
    const [dragged] = newTasks.splice(dragIndex, 1);
    newTasks.splice(targetIndex, 0, dragged);
    setTasks(newTasks);
    setDraggedId(null);
  };

  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <li
          key={task.id}
          draggable
          onDragStart={() => setDraggedId(task.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleDrop(e, task.id)}
          className={`flex items-center gap-4 p-4 bg-card/50 text-foreground/90 border border-border/40 rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:-translate-y-1 hover:bg-card hover:border-border/80 transition-all ${
            draggedId === task.id ? "opacity-40 border-dashed scale-[0.98]" : ""
          }`}
        >
          <div className="w-1.5 h-6 rounded-full bg-primary/20" />
          <span className="font-medium">{task.title}</span>
        </li>
      ))}
    </ul>
  );
}
