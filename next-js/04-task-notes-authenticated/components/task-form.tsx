// components/task-form.tsx
"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

interface TaskFormProps {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    title?: string;
    priority?: "low" | "medium" | "high";
    completed?: boolean;
  };
  submitLabel: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`px-6 py-2 rounded-md font-medium ${
        pending
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
      } text-white focus:outline-none focus:ring-offset-2`}
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

export function TaskForm({
  action,
  defaultValues = {},
  submitLabel,
}: TaskFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (formData: FormData) => {
    const newErrors: Record<string, string> = {};
    const title = formData.get("title") as string;

    if (!title || title.trim().length === 0) {
      newErrors.title = "Title is required";
    } else if (title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (formData: FormData) => {
    if (!validateForm(formData)) {
      return;
    }

    try {
      await action(formData);
    } catch (error) {
      setErrors({ general: "Failed to save task. Please try again." });
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errors.general}
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Task Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          defaultValue={defaultValues.title}
          className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
            errors.title
              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          }`}
          placeholder="What needs to be done?"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="priority"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Priority Level
        </label>
        <select
          id="priority"
          name="priority"
          defaultValue={defaultValues.priority || "medium"}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {defaultValues.completed !== undefined && (
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="completed"
              defaultChecked={defaultValues.completed}
              className="rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Mark as completed
            </span>
          </label>
        </div>
      )}

      <div className="flex space-x-3">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
