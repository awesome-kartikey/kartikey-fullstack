// components/TaskCard.tsx

import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { Task } from "@/lib/types";
import { theme } from "@/lib/theme";
import { AnimatedStatus } from "@/components/AnimatedStatus";
import { AnimatedButtonWrapper } from "@/components/AnimatedButtonWrapper";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  return (
    <Card className="flex flex-col justify-between h-full border-muted hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
      
      {/* HEADER */}
      <CardHeader className="space-y-2">
        <h3 className="text-lg font-semibold leading-tight">
          {task.title}
        </h3>

        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
      </CardHeader>

      {/* META INFO */}
      <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
        
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {new Date(task.createdAt).toLocaleDateString()}
        </div>

        <div className="flex items-center gap-2">

          <Badge
            variant="secondary"
            className={`capitalize ${theme.colors.priority[task.priority]}`}
          >
            {task.priority}
          </Badge>

          <AnimatedStatus completed={task.completed} />

        </div>
      </CardContent>

      {/* ACTIONS */}
      <CardFooter className="flex justify-end gap-2 pt-2">
        <AnimatedButtonWrapper>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/tasks/${task.id}`}>View</Link>
          </Button>
        </AnimatedButtonWrapper>

        <AnimatedButtonWrapper>
          <Button size="sm" asChild>
            <Link href={`/tasks/${task.id}/edit`}>Edit</Link>
          </Button>
        </AnimatedButtonWrapper>
      </CardFooter>
    </Card>
  );
}