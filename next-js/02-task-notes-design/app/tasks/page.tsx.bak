import Link from "next/link";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasks",
  description: "View and manage all your tasks",
  openGraph: {
    title: 'My Tasks — Task Notes',
    description: 'View and manage all your tasks',
    type: 'website',
  },
};

const tasks = [
  {
    id: "1",
    title: "Task 1",
  },
  {
    id: "2",
    title: "Task 2",
  },
  {
    id: "3",
    title: "Task 3",
  },
];

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function TasksPage() {
  await delay(3000);
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Tasks</h1>
      <p className="text-gray-500">
        Tasks will appear here once we connect to the API.
      </p>
      {tasks.map((task) => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <Link href={`/tasks/${task.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}

// export default function TasksPage() {
//   throw new Error("Task failed to load");
// }
