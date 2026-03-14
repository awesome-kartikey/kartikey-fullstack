import NotFound from "../not-found";
import { Metadata } from "next";

// app/tasks/[id]/page.tsx
interface TaskDetailPageProps {
  params: {
    id: string;
  };
}

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

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  return {
    title: `Task ${params.id} - Task Notes`,
    description: `View and edit task ${params.id}`,
    openGraph: {
      title: `Task ${params.id}`,
      description: "Task management application",
      type: "website",
    },
  };
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;
  const checkTask = tasks.find((task) => task.id === id);

  if (!checkTask) {
    return NotFound();
  } else {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Task Details</h1>
        <p>Viewing task with ID: {id}</p>
        {/* In later sections, we'll fetch actual task data here */}
        <p className="text-sm text-slate-400 mt-2">
          (Real data will be fetched Later)
        </p>
      </div>
    );
  }
}
