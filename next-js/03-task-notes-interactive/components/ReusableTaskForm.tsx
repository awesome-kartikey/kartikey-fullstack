"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 1. Client-side validation schema
const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(50),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  completed: z.boolean().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

// 2. Reusable props
interface ReusableFormProps {
  defaultValues?: Partial<TaskFormValues>;
  onSubmitAction: (data: TaskFormValues) => Promise<void>;
  submitLabel: string;
  showCompletedToggle?: boolean;
}

export function ReusableTaskForm({
  defaultValues,
  onSubmitAction,
  submitLabel,
  showCompletedToggle,
}: ReusableFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema as any),
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      priority: defaultValues?.priority || "medium",
      completed: defaultValues?.completed || false,
    },
  });

  const handleFormSubmit = async (data: TaskFormValues) => {
    try {
      await onSubmitAction(data);
      toast.success(`${submitLabel} successful!`);
    } catch {
      toast.error("Action failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Title Field */}
      <div className="space-y-2">
        <Label htmlFor="title" className={errors.title ? "text-red-500" : ""}>
          Task Title *
        </Label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="title"
              placeholder="Task title"
              className={
                errors.title ? "border-red-500 focus-visible:ring-red-500" : ""
              }
            />
          )}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              id="description"
              placeholder="Details..."
              className="resize-none"
            />
          )}
        />
      </div>

      {/* Priority Select */}
      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
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

      {/* Completed Toggle */}
      {showCompletedToggle && (
        <div className="space-y-2">
          <Controller
            name="completed"
            control={control}
            render={({ field }) => (
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium">Mark as Completed</span>
              </label>
            )}
          />
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full sm:w-auto"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
