// components/TasksClientView.tsx
"use client";
import { useState } from "react";
import { Task } from "@/lib/api";
import { TaskSearch } from "@/components/TaskSearch";
import { SortableList } from "@/components/SortableList";
import { BulkActions } from "@/components/BulkActions";
import { Button } from "@/components/ui/button";

type ViewMode = "search" | "sort" | "bulk";

export function TasksClientView({ tasks }: { tasks: Task[] }) {
  const [view, setView] = useState<ViewMode>("search");

  return (
    <div>
      <div className="inline-flex h-10 items-center justify-center rounded-lg bg-muted/60 p-1 text-muted-foreground mb-8">
        <button
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
            view === "search"
              ? "bg-background text-foreground shadow-sm"
              : "hover:text-foreground hover:bg-background/50"
          }`}
          onClick={() => setView("search")}
        >
          Overview
        </button>
        <button
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
            view === "sort"
              ? "bg-background text-foreground shadow-sm"
              : "hover:text-foreground hover:bg-background/50"
          }`}
          onClick={() => setView("sort")}
        >
          Reorder
        </button>
        <button
          className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium transition-all ${
            view === "bulk"
              ? "bg-background text-foreground shadow-sm"
              : "hover:text-foreground hover:bg-background/50"
          }`}
          onClick={() => setView("bulk")}
        >
          Bulk Actions
        </button>
      </div>

      {view === "search" && <TaskSearch initialTasks={tasks} />}
      {view === "sort" && <SortableList initialTasks={tasks} />}
      {view === "bulk" && <BulkActions tasks={tasks} />}
    </div>
  );
}
