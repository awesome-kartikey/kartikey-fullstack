// app/page.tsx
import Link from 'next/link';
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Task Notes — your personal task management application.',
  openGraph: {
    siteName: 'Task Notes',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Task Notes App</h1>
      <p className="mb-4">Welcome to your task management application!</p>
      <nav className="space-x-4">
        <Link href="/tasks" className="text-blue-600 hover:underline">
          View Tasks
        </Link>
        <Link href="/about" className="text-blue-600 hover:underline">
          About
        </Link>
      </nav>
    </div>
  );
}