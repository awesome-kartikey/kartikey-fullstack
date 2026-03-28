// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-slate-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you are looking for does not exist.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Go Home
          </Link>
          <Link
            href="/tasks"
            className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50"
          >
            View Tasks
          </Link>
        </div>
      </div>
    </div>
  );
}
