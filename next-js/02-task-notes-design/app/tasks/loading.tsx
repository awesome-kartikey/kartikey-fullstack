// app/tasks/loading.tsx
export default function Loading() {
  return (
    <div className="p-8">
      <div className="animate-pulse">
        <div className="h-8 bg-slate-300 rounded mb-4 w-1/3"></div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-300 rounded"></div>
          <div className="h-4 bg-slate-300 rounded w-5/6"></div>
          <div className="h-4 bg-slate-300 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
}