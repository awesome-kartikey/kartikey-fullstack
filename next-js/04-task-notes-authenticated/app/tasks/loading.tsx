// app/tasks/loading.tsx
export default function Loading() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 bg-gray-200 animate-pulse rounded w-32"></div>
        <div className="h-10 bg-gray-200 animate-pulse rounded w-24"></div>
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border rounded p-4">
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 animate-pulse rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
