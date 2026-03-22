// app/tasks/[id]/page.tsx
import { Metadata } from "next";
import { api } from "@/lib/api";
import Link from "next/link";
import { ApiError } from "@/lib/api";
import { TaskActions } from "@/components/task-actions";
import { AutoSaveField } from "@/components/AutoSaveField";
import { notFound, redirect } from "next/navigation";
import { theme } from "@/lib/theme";
import { Button } from "@/components/ui/button";

interface TaskDetailPageProps {
  params: Promise<{
    id: string;
  }>;
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
    if (error instanceof ApiError) {
      if (error.status === 404) notFound();
      if (error.status === 403) redirect("/tasks");
    }
    throw error;
  }
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Back Navigation */}
      <div className="mb-8">
        <Link
          href="/tasks"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
        >
          <span className="mr-2 inline-block transition-transform group-hover:-translate-x-1">&larr;</span>
          Back to Tasks
        </Link>
      </div>

      <div className="space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground/90 leading-tight">
              {task.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${task.completed
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                }`}
            >
              {task.completed ? "Completed" : "In Progress"}
            </span>

            <span className="w-1 h-1 rounded-full bg-border" />

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${theme.colors.priority[task.priority]}`}
            >
              {task.priority} Priority
            </span>

            <span className="w-1 h-1 rounded-full bg-border hidden sm:block" />

            <span className="hidden sm:inline-flex items-center gap-1.5">
              <span>Created</span>
              <time className="text-foreground/80 font-medium">
                {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </time>
            </span>
          </div>
        </div>

        <hr className="border-border/40" />

        {/* Notes/Description Area */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase mb-4">Notes</p>
          <div className="bg-card/30 border border-border/40 rounded-xl p-4 sm:p-6 shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30 transition-all">
            <AutoSaveField
              taskId={task.id}
              initialValue={task.description || ""}
            />
          </div>
          <p className="text-xs text-muted-foreground/60 mt-2 text-right">
            Last edited {new Date(task.updatedAt).toLocaleDateString(undefined, { hour: 'numeric', minute: '2-digit' })}
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-4 pt-6 mt-8 border-t border-border/40">
          <Button asChild className="shadow-sm">
            <Link href={`/tasks/${task.id}/edit`}>
              Edit Details
            </Link>
          </Button>
          <div className="opacity-90 hover:opacity-100 transition-opacity">
            <TaskActions
              task={{ id: task.id, title: task.title, completed: task.completed }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
