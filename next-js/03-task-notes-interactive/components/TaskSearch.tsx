// components/TaskSearch.tsx
"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Task } from "@/lib/api";
import { TaskCard } from "@/components/TaskCard";
import { AnimatedTaskCard } from "@/components/AnimatedTaskCard";

export function TaskSearch({ initialTasks }: { initialTasks: Task[] }) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce: wait 300ms after user stops typing
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  const filteredTasks = initialTasks.filter((task) =>
    task.title.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <Input
        type="search"
        placeholder="Search tasks..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-md"
      />
      <p className="text-sm text-muted-foreground">
        Showing {filteredTasks.length} of {initialTasks.length} tasks
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground py-8">
            No tasks match your search.
          </p>
        ) : (
          filteredTasks.map((task, index) => (
              <AnimatedTaskCard key={task.id} index={index}>
                <TaskCard task={task} />
              </AnimatedTaskCard>
            ))
        )}
      </div>
    </div>
  );
}
