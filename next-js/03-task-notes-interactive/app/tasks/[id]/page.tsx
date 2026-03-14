// app/tasks/[id]/page.tsx
import { Metadata } from "next";
import { api } from "@/lib/api";
import Link from "next/link";
import { ApiError } from "@/lib/api";
import { TaskActions } from "@/components/task-actions";
import { AutoSaveField } from "@/components/AutoSaveField";
import { notFound } from "next/navigation";

interface TaskDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: TaskDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const task = await api.getTask(id);
    return {
      title: `Task ${task.id} - Task Notes`,
      description: `View and edit task ${task.id}`,
    };
  } catch {
    return {
      title: "Task Not Found - Task Notes",
    };
  }
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;
  let task;
  try {
    task = await api.getTask(id);
  } catch (error) {
    if ((error as ApiError).status === 404) {
      notFound();
    }
    throw error;
  }
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/tasks" className="text-blue-600 hover:underline">
          Back to Tasks
        </Link>
      </div>

      <div className="bg-white border rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              task.completed
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {task.completed ? "Completed" : "Pending"}
          </span>
        </div>

        <div className="space-y-3 text-gray-600">
          <div>
            <strong>Priority:</strong>
            <span
              className={`ml-2 px-2 py-1 rounded text-xs ${
                task.priority === "high"
                  ? "bg-red-100 text-red-800"
                  : task.priority === "medium"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
              }`}
            >
              {task.priority}
            </span>
          </div>
          <div>
            <strong>Created:</strong>{" "}
            {new Date(task.createdAt).toLocaleString()}
          </div>
          <div>
            <strong>Last Updated:</strong>{" "}
            {new Date(task.updatedAt).toLocaleString()}
          </div>
        </div>
        <div className="mt-4 border-t pt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
          <AutoSaveField
            taskId={task.id}
            initialValue={task.description || ""}
          />
        </div>

        <div className="mt-6 flex space-x-3">
          <Link
            href={`/tasks/${task.id}/edit`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Task
          </Link>
          <TaskActions
            task={{ id: task.id, title: task.title, completed: task.completed }}
          />
        </div>
      </div>
    </div>
  );
}
