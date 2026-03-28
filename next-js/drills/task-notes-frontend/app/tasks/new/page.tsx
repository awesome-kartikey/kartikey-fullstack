"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ReusableTaskForm,
  TaskFormValues,
} from "@/components/ReusableTaskForm";
import { createTaskAction } from "./actions";
import { toast } from "sonner";

export default function NewTaskPage() {
  const router = useRouter();

  const handleCreate = async (data: TaskFormValues) => {
    try {
      await createTaskAction(data);
      toast.success("Task created successfully!");
      router.push("/tasks");
    } catch (error) {
      toast.error("Failed to create task");
      throw error;
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-2xl relative min-h-[calc(100vh-140px)] flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] opacity-60 pointer-events-none" />

      <Card className="shadow-2xl bg-card/60 backdrop-blur-xl border-border/40 relative z-10 p-2 sm:p-4 rounded-2xl">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight">Create New Task</CardTitle>
          <CardDescription className="text-base">
            Add a new task to your list with priority and details.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ReusableTaskForm
            onSubmitAction={handleCreate}
            submitLabel="Create Task"
            showCompletedToggle={false}
          />
          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto hover:bg-muted/50 transition-colors"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
