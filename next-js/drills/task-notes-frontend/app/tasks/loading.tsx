// app/tasks/loading.tsx
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 content-start">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="flex flex-col justify-between h-[200px] p-5 border-border/40 bg-card/50 shadow-sm relative overflow-hidden">
          <div className="space-y-4 z-10 relative">
            <div className="flex items-start justify-between gap-4">
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-5 w-5 rounded-md" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
          </div>

          <div className="pt-4 mt-auto flex items-center justify-between z-10 relative">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
