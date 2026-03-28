'use client'

import { useMemo, useState } from 'react'

type ProjectView = {
    id: string
    name: string
    status: string
    tech: string[]
    leadName: string
    description: string
}

export default function ProjectSearch({
    projects,
}: {
    projects: ProjectView[]
}) {
    const [query, setQuery] = useState('')

    const filteredProjects = useMemo(() => {
        const normalized = query.trim().toLowerCase()

        if (!normalized) {
            return projects
        }

        return projects.filter((project) => {
            return (
                project.name.toLowerCase().includes(normalized) ||
                project.status.toLowerCase().includes(normalized) ||
                project.tech.some((item) => item.toLowerCase().includes(normalized)) ||
                project.leadName.toLowerCase().includes(normalized)
            )
        })
    }, [projects, query])

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="project-search" className="mb-2 block font-medium">
                    Filter projects
                </label>
                <input
                    id="project-search"
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search by name, status, tech, or lead"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {filteredProjects.map((project) => (
                    <article
                        key={project.id}
                        className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                    >
                        <h2 className="text-xl font-semibold">{project.name}</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            <span className="font-medium text-gray-900">Status:</span>{' '}
                            {project.status}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-900">Lead:</span>{' '}
                            {project.leadName}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-medium text-gray-900">Tech:</span>{' '}
                            {project.tech.join(', ')}
                        </p>
                        <p className="mt-3 text-gray-700">{project.description}</p>
                    </article>
                ))}

                {filteredProjects.length === 0 ? (
                    <p className="text-gray-600">No projects match your search.</p>
                ) : null}
            </div>
        </div>
    )
}
