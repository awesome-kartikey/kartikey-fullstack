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

export default function EditTaskClient({ task }: { task: Task }) {
  const router = useRouter();
  const handleUpdate = async (data: TaskFormValues) => {
    await updateTaskAction(task.id, data);
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Edit Task</CardTitle>
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
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
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
