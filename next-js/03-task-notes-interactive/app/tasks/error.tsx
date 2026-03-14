// app/tasks/error.tsx
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Tasks page error:", error);
  }, [error]);

  return (
    <div className="p-8">
      <div className="max-w-md mx-auto text-center">
        <h2 className="text-xl font-semibold mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">
          There was a problem loading your tasks. This could be due to a network
          issue or server problem.
        </p>
        <div className="space-x-3">
          <button
            onClick={reset}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Go Home
          </button>
        </div>
        <div className="p-8">
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <p className="text-red-700">
              Failed to load tasks. Please try again later.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
