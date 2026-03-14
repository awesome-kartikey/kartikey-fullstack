"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AnimatedButtonWrapper } from "@/app/components/AnimatedButtonWrapper";
import { createTask } from "./actions";

// 1. Define our validation rules using Zod
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(50),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
});

type TaskFormValues = z.infer<typeof formSchema>;

export default function NewTaskPage() {
  const router = useRouter();

  // 2. Initialize React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
    },
  });

  // 3. Handle submission
  const onSubmit = async (data: TaskFormValues) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      formData.append("priority", data.priority);
      await createTask(formData);
      toast.success("Task created successfully!");
      router.push("/tasks"); // Redirect back to task list
    } catch {
      toast.error("Failed to create task. Please try again.");
    }
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* TITLE FIELD */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className={errors.title ? "text-red-500" : ""}
              >
                Task Title
              </Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="title"
                    placeholder="Enter task title..."
                    aria-invalid={!!errors.title}
                    className={
                      errors.title
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }
                  />
                )}
              />
              {/* Error Message */}
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* DESCRIPTION FIELD */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    id="description"
                    placeholder="Add task details..."
                    className="resize-none"
                  />
                )}
              />
            </div>

            {/* PRIORITY SELECT FIELD */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      className={errors.priority ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 pt-4">
              <AnimatedButtonWrapper>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Task"
                  )}
                </Button>
              </AnimatedButtonWrapper>
              <AnimatedButtonWrapper>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </AnimatedButtonWrapper>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
