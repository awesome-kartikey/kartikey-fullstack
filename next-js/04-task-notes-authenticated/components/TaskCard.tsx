// components/TaskCard.tsx

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";
import { Task } from "@/lib/types";
import { theme } from "@/lib/theme";
import { AnimatedStatus } from "@/components/AnimatedStatus";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Link 
      href={`/tasks/${task.id}`} 
      className="group block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
    >
      <Card className="flex flex-col justify-between h-full p-5 border-border/40 bg-card/50 hover:bg-card hover:border-border/80 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
        
        {/* Subtle hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="space-y-3 z-10 relative">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-medium tracking-tight text-foreground/90 group-hover:text-foreground transition-colors">
              {task.title}
            </h3>
            <ChevronRight className="w-5 h-5 text-muted-foreground/0 group-hover:text-muted-foreground transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0" />
          </div>

          {task.description && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Badge
              variant="outline"
              className={`capitalize font-medium px-2.5 py-0.5 rounded-full ${theme.colors.priority[task.priority]}`}
            >
              {task.priority}
            </Badge>

            <AnimatedStatus completed={task.completed} />
          </div>
        </div>

        {/* Footer Meta */}
        <div className="pt-4 mt-auto border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground/80 z-10 relative">
          <div className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}