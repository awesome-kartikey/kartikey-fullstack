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

      {/* Simple Modal overlay */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-bold mb-2">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete {task.title}?
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending}
              >
                {isPending ? "Deleting..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
