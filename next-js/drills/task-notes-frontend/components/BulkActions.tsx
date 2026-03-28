// components/BulkActions.tsx
"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { bulkDeleteTasks } from "@/lib/actions";
import { toast } from "sonner";
import { AnimatedButtonWrapper } from "@/components/AnimatedButtonWrapper";

interface TaskStub {
  id: string;
  title: string;
}

export function BulkActions({ tasks }: { tasks: TaskStub[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelected(next);
  };

  const handleDeleteSelected = () => {
    startTransition(async () => {
      try {
        await bulkDeleteTasks([...selected]);
        toast.success(`Deleted ${selected.size} task(s)`);
        setSelected(new Set());
      } catch {
        toast.error("Failed to delete some tasks");
      }
    });
  };

  return (
    <div>
      {selected.size > 0 && (
        <div className="mb-4 p-3 bg-primary/10 flex gap-4 items-center rounded border border-primary/20">
          <span className="font-bold text-primary">
            {selected.size} selected
          </span>
          <AnimatedButtonWrapper>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete Selected"}
            </Button>
          </AnimatedButtonWrapper>
          <AnimatedButtonWrapper>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelected(new Set())}
            >
              Clear
            </Button>
          </AnimatedButtonWrapper>
        </div>
      )}
      <div className="space-y-3">
        {tasks.map((task) => (
          <label
            key={task.id}
            className={`flex gap-4 items-center p-4 border border-border/40 rounded-xl transition-all cursor-pointer ${
              selected.has(task.id) 
                ? "bg-primary/5 border-primary/30 shadow-sm" 
                : "bg-card/50 hover:bg-card hover:border-border/80"
            }`}
          >
            <input
              type="checkbox"
              checked={selected.has(task.id)}
              onChange={() => toggleOne(task.id)}
              className="w-4 h-4 rounded border-primary text-primary focus:ring-primary/20 transition-colors"
            />
            <span className="font-medium text-foreground/90">{task.title}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
