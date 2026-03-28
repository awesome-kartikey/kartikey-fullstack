// components/task-actions.tsx
"use client";

import { useState, useTransition, useOptimistic } from "react";
import { toggleTaskCompletion, deleteTask } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AnimatedButtonWrapper } from "@/components/AnimatedButtonWrapper";

interface TaskActionsProps {
  task: {
    id: string;
    title: string;
    completed: boolean;
  };
}

export function TaskActions({ task }: TaskActionsProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [optimisticCompleted, addOptimisticToggle] = useOptimistic(
    task.completed,
    (state, newValue: boolean) => newValue,
  );

  const handleToggleComplete = () => {
    const originalStatus = task.completed;

    startTransition(async () => {
      addOptimisticToggle(!originalStatus);
      try {
        await toggleTaskCompletion(task.id, !originalStatus );
      } catch (error) {
        toast.error("Failed to update task status");
        console.error("Failed to toggle task:", error);
      }
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteTask(task.id);
        toast.success("Task deleted successfully");
        setIsDeleteModalOpen(false);
        router.push("/tasks");
      } catch (error) {
        toast.error("Failed to delete task");
        console.error("Failed to delete task:", error);
      }
    });
  };
  return (
    <div className="flex gap-2 items-center">
      <AnimatedButtonWrapper>
        <Button
          variant={optimisticCompleted ? "outline" : "default"}
          size="sm"
          onClick={handleToggleComplete}
          disabled={isPending}
        >
          {optimisticCompleted ? "Mark Incomplete" : "Mark Complete"}
        </Button>
      </AnimatedButtonWrapper>

      <AnimatedButtonWrapper>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          Delete
        </Button>
      </AnimatedButtonWrapper>

      {/* Modal overlay */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-card/95 backdrop-blur-md p-6 rounded-2xl max-w-sm w-full shadow-2xl border border-border/50 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-3 tracking-tight">Confirm Delete</h3>
            <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
              Are you sure you want to delete <span className="text-foreground font-semibold">&quot;{task.title}&quot;</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                className="hover:bg-muted/50"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="px-6"
                onClick={handleDelete}
                disabled={isPending}
              >
                {isPending ? "Deleting..." : "Delete Task"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
