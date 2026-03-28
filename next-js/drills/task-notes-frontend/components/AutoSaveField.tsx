// components/AutoSaveField.tsx
"use client";
import { useState, useEffect } from "react";
import { updateTaskDescription } from "@/lib/actions";

export function AutoSaveField({
  taskId,
  initialValue,
}: {
  taskId: string;
  initialValue: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState<"saved" | "saving" | "unsaved">("saved");

  const [prevInitialValue, setPrevInitialValue] = useState(initialValue);

  if (initialValue !== prevInitialValue) {
    setValue(initialValue);
    setPrevInitialValue(initialValue);
    setStatus("saved");
  }

  useEffect(() => {
    if (value === initialValue) return; // No change, skip
    const timer = setTimeout(async () => {
      setStatus("saving");
      try {
        await updateTaskDescription(taskId, value);
        setStatus("saved");
      } catch {
        setStatus("unsaved");
      }
    }, 1500); // Auto-save after 1.5s of inactivity
    return () => clearTimeout(timer);
  }, [value, taskId, initialValue]);

  return (
    <div>
      <textarea
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setStatus("unsaved");
        }}
        className="border p-2 w-full rounded min-h-20 resize-none text-sm"
        placeholder="Add a description..."
      />
      <span className="text-xs text-muted-foreground mt-1 block">
        {status === "saving"
          ? "Saving..."
          : status === "unsaved"
            ? "Unsaved changes"
            : "All changes saved"}
      </span>
    </div>
  );
}
