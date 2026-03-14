import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about the Task Notes application.',
};

export default function AboutPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">About Task Notes</h1>
      <p>
        Task Notes is a simple task management application built with
        Next.js and connected to a REST API.
      </p>
    </div>
  );
}