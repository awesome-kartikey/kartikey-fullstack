import Link from "next/link";
import { team } from "@/lib/data";

export default function TeamPage() {
  return (
    <main className="space-y-6">
      <header className="space-y-3">
        <Link href="/" className="text-blue-700">
          ⬅️ Home
        </Link>
        <h1 className="text-3xl font-bold">Team directory</h1>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {team.map((member) => (
          <article
            key={member.id}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold">{member.name}</h2>
            <p className="mt-2 text-gray-700">
              <span className="font-medium text-gray-900">Role:</span>{" "}
              {member.role}
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-gray-900">Department:</span>{" "}
              {member.dept}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
