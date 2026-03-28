"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(taskSchema as any),
    defaultValues: {
      title: defaultValues?.title || "",
      description: defaultValues?.description || "",
      priority: defaultValues?.priority || "medium",
      completed: defaultValues?.completed || false,
    },
  });

  const handleFormSubmit = async (data: TaskFormValues) => {
    await onSubmitAction(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Title Field */}
      <div className="space-y-2.5">
        <Label htmlFor="title" className={`font-medium ${errors.title ? "text-destructive" : "text-foreground/80"}`}>
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
              className={`bg-background/50 border-border/50 focus-visible:ring-primary/30 h-11 ${
                errors.title ? "border-destructive/50 focus-visible:ring-destructive/30" : ""
              }`}
            />
          )}
        />
        {errors.title && (
          <p className="text-sm font-medium text-destructive">{errors.title.message}</p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-2.5">
        <Label htmlFor="description" className="font-medium text-foreground/80">Description</Label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              id="description"
              placeholder="Details..."
              className="resize-none bg-background/50 border-border/50 focus-visible:ring-primary/30 min-h-[120px]"
            />
          )}
        />
      </div>

      {/* Priority Select */}
      <div className="space-y-2.5">
        <Label htmlFor="priority" className="font-medium text-foreground/80">Priority</Label>
        <Controller
          name="priority"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                className={`bg-background/50 border-border/50 focus:ring-primary/30 h-11 ${
                  errors.priority ? "border-destructive/50" : ""
                }`}
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
        <div className="pt-2">
          <Controller
            name="completed"
            control={control}
            render={({ field }) => (
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="w-5 h-5 rounded border-primary text-primary focus:ring-primary/20 transition-colors"
                />
                <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">Mark as Completed</span>
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
