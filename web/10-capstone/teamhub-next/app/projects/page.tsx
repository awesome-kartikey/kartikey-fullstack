import Link from "next/link";
import ProjectSearch from "@/components/ProjectSearch";
import { getMemberName, projects } from "@/lib/data";

export default function ProjectsPage() {
  console.log("rendered on server");

  const projectViews = projects.map((project) => ({
    id: project.id,
    name: project.name,
    status: project.status,
    tech: project.tech,
    leadName: getMemberName(project.lead),
    description: project.description,
  }));

  return (
    <main className="space-y-6">
      <header className="space-y-3">
        <Link href="/" className="text-blue-700">
          ⬅️ Home
        </Link>
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-gray-600">
          Server-rendered page with a client-side project filter.
        </p>
      </header>

      <ProjectSearch projects={projectViews} />
    </main>
  );
}
