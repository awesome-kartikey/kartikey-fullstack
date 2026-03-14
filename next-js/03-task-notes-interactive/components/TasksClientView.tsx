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
      <div className="flex gap-2 mb-6 flex-wrap">
        <Button
          variant={view === "search" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("search")}
        >
          Grid / Search
        </Button>
        <Button
          variant={view === "sort" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("sort")}
        >
          Reorder
        </Button>
        <Button
          variant={view === "bulk" ? "default" : "outline"}
          size="sm"
          onClick={() => setView("bulk")}
        >
          Bulk Select
        </Button>
      </div>

      {view === "search" && <TaskSearch initialTasks={tasks} />}
      {view === "sort" && <SortableList initialTasks={tasks} />}
      {view === "bulk" && <BulkActions tasks={tasks} />}
    </div>
  );
}
