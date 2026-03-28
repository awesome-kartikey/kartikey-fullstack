import Link from "next/link";
import { notFound } from "next/navigation";
import { getMemberName, projects } from "@/lib/data";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((item) => item.id === id);

  if (!project) {
    notFound();
  }

  return (
    <main className="space-y-6">
      <Link href="/projects" className="text-blue-700">
        ⬅️ Back to projects
      </Link>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="mt-4 text-gray-700">
          <span className="font-medium text-gray-900">Status:</span>{" "}
          {project.status}
        </p>
        <p className="text-gray-700">
          <span className="font-medium text-gray-900">Lead:</span>{" "}
          {getMemberName(project.lead)}
        </p>
        <p className="text-gray-700">
          <span className="font-medium text-gray-900">Tech stack:</span>{" "}
          {project.tech.join(", ")}
        </p>
        <p className="mt-4">{project.description}</p>

        <h2 className="mt-6 text-xl font-semibold">Team members</h2>
        <ul className="mt-3 list-disc pl-6 text-gray-700">
          {project.team.map((memberId) => (
            <li key={memberId}>{getMemberName(memberId)}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
