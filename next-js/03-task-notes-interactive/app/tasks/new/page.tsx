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

export default function NewTaskPage() {
  const router = useRouter();

  const handleCreate = async (data: TaskFormValues) => {
    await createTaskAction(data);
  };

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
          <CardDescription>
            Add a new task to your list with priority and details.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ReusableTaskForm
            onSubmitAction={handleCreate}
            submitLabel="Create Task"
            showCompletedToggle={false}
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
