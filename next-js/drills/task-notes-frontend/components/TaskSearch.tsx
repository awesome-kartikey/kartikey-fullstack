// components/TaskSearch.tsx
"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Task } from "@/lib/api";
import { TaskCard } from "@/components/TaskCard";
import { AnimatedTaskCard } from "@/components/AnimatedTaskCard";
import { Search } from "lucide-react";

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/70" />
          <Input
            type="search"
            placeholder="Search tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-muted/30 border-border/50 focus-visible:ring-primary/20 transition-all rounded-lg"
          />
        </div>
        <p className="text-sm font-medium text-muted-foreground/80">
          Showing <span className="text-foreground">{filteredTasks.length}</span> of {initialTasks.length} tasks
        </p>
      </div>
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
