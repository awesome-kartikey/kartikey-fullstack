// app/tasks/[id]/edit/page.tsx
import { api, ApiError } from "@/lib/api";
import { notFound, redirect } from "next/navigation";
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
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) notFound();
      if (error.status === 403) redirect("/tasks");
    }
    throw error;
  }

  // Pass the fetched task to our Client Component form
  return <EditTaskClient task={task} />;
}
