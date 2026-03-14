// app/tasks/page.tsx
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { TasksClientView } from "@/components/TasksClientView";

export default async function TasksPage() {
  let tasks;
  try {
    tasks = await api.getTasks();
  } catch (error) {
    // if failed to fetch tasks from api\
    throw error;
  }
  return (
    <div className="container mx-auto p-8">
      {/* Add New Task Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Tasks</h1>
        <Button asChild>
          <Link
            href="/tasks/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add New Task
          </Link>
        </Button>
      </div>
      {/* If No Tasks Available it will show Create New Task Button */}
      {tasks.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">No tasks yet!</p>
            <Button asChild variant="outline">
              <Link href="/tasks/new" className="text-blue-600 hover:underline">
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
