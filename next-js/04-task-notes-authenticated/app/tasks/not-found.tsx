import Link from "next/link";

export default function NotFound() {
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Task Not Found</h2>
      <p className="text-gray-600 mb-6">
        Could not find the task you are looking for.
      </p>
      <Link
        href="/tasks"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Back to all tasks
      </Link>
    </div>
  );
}
