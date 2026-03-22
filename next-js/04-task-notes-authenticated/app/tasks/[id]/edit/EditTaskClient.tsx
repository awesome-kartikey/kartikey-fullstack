"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateTaskAction } from "./actions";
import { Task } from "@/lib/api";
import {
  ReusableTaskForm,
  TaskFormValues,
} from "@/components/ReusableTaskForm";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function EditTaskClient({ task }: { task: Task }) {
  const router = useRouter();
  const handleUpdate = async (data: TaskFormValues) => {
    try {
      await updateTaskAction(task.id, data);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-8 max-w-2xl relative min-h-[calc(100vh-140px)] flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] opacity-60 pointer-events-none" />

      <Card className="shadow-2xl bg-card/60 backdrop-blur-xl border-border/40 relative z-10 p-2 sm:p-4 rounded-2xl">
        <CardHeader className="space-y-2 pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight">Edit Task</CardTitle>
        </CardHeader>
        <CardContent>
          <ReusableTaskForm
            defaultValues={{
              title: task.title,
              description: task.description || "",
              priority: task.priority,
              completed: task.completed,
            }}
            onSubmitAction={handleUpdate}
            submitLabel="Update Task"
            showCompletedToggle={true}
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
