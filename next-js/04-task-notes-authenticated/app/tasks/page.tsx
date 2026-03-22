// app/tasks/page.tsx
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { TasksClientView } from "@/components/TasksClientView";

export default async function TasksPage() {
  const tasks = await api.getTasks();
  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Add New Task Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-foreground">Your Tasks</h1>
        <Button asChild>
          <Link href="/tasks/new">
            Add New Task
          </Link>
        </Button>
      </div>

      {/* If No Tasks Available it will show Create New Task Button */}
      {tasks.length === 0 ? (
        <Card className="text-center py-16 border-dashed border-2 shadow-sm">
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground text-lg">No tasks yet!</p>
            <Button asChild variant="default">
              <Link href="/tasks/new">
                Create your first task
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        // But if the tasks are available it will show the tasks
        <TasksClientView tasks={tasks} />
      )}
    </div>
  );
}
