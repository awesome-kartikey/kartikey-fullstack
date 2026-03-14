// app/tasks/[id]/edit/page.tsx
import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import EditTaskClient from "./EditTaskClient";

interface EditTaskPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTaskPage({ params }: EditTaskPageProps) {
  const { id } = await params;
  let task;
  try {
    // Fetch the task data from the server
    task = await api.getTask(id);
  } catch (error: any) {
    // TASK 4: Error handling for tasks that don't exist
    if (error.status === 404) notFound();
    throw error;
  }

  // Pass the fetched task to our Client Component form
  return <EditTaskClient task={task} />;
}
