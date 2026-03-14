// components/TaskCard.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';
import { Task } from '@/lib/types';
import {theme} from '@/lib/theme';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              {task.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              Created {new Date(task.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={theme.colors.priority[task.priority]}
            >
              {task.priority}
            </Badge>
            <Badge variant={task.completed ? "default" : "outline"}>
              {task.completed ? 'Completed' : 'Pending'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-3">
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/tasks/${task.id}`}>
              View Details
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/tasks/${task.id}/edit`}>
              Edit
            </Link>
          </Button>
        </div>
        
      </CardContent>
    </Card>
  );
}