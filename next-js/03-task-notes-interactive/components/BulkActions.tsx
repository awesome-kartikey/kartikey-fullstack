// components/BulkActions.tsx
"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { bulkDeleteTasks } from "@/lib/actions";
import { toast } from "sonner";
import { AnimatedButtonWrapper } from "@/components/AnimatedButtonWrapper";
import { revalidatePath } from "next/cache";

interface TaskStub {
  id: string;
  title: string;
}

export function BulkActions({ tasks }: { tasks: TaskStub[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const handleDeleteSelected = () => {
    startTransition(async () => {
      try {
        await bulkDeleteTasks([...selected]);
        toast.success(`Deleted ${selected.size} task(s)`);
        setSelected(new Set());
        revalidatePath("/tasks");
      } catch {
        toast.error("Failed to delete some tasks");
      }
    });
  };

  return (
    <div>
      {selected.size > 0 && (
        <div className="mb-4 p-3 bg-blue-50 flex gap-4 items-center rounded border border-blue-200">
          <span className="font-bold text-blue-800">
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
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex gap-3 items-center p-3 border rounded bg-card"
          >
            <input
              type="checkbox"
              checked={selected.has(task.id)}
              onChange={() => toggleOne(task.id)}
              className="w-4 h-4 cursor-pointer"
            />
            <span>{task.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
