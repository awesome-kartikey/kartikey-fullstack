// app/tasks/page.tsx - Updated with shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { TaskCard } from "@/components/TaskCard";

async function getTasks() {
  return [
    {
      id: "1",
      title: "Task 1",
      description: "This is a task description",
      priority: "low" as const,
      completed: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Task 2",
      description: "This is a task description",
      priority: "medium" as const,
      completed: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Task 3",
      description: "This is a task description",
      priority: "high" as const,
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ];
}
async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function TasksPage() {
  const tasks = await getTasks();
  await delay(3000);
  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Tasks</h1>
        <Button asChild>
          <Link href="/tasks/new">Add New Task</Link>
        </Button>
      </div>

      {tasks.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">No tasks yet!</p>
            <Button asChild variant="outline">
              <Link href="/tasks/new">Create your first task</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
