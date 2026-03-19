"use client";

import { useTransition } from "react";
import { Task } from "@/lib/generated/prisma/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquareText, RotateCcw, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CurrentView, useDashboardStore } from "@/app/store/dashboardStore";
import { restoreTask, deleteTask } from "@/app/actions/tasks";
import { toast } from "sonner";

interface TaskWithCount extends Task {
  _count?: {
    messages: number;
  };
}

interface TrashCardProps {
  task: TaskWithCount;
}

function TrashCard({ task }: TrashCardProps) {
  const [isPendingRestore, startRestoreTransition] = useTransition();
  const [isPendingDelete, startDeleteTransition] = useTransition();

  const setSelectedTask = useDashboardStore((state) => state.setSelectedTask);
  const setCurrentDashboardView = useDashboardStore((state) => state.setCurrentDashboardView);
  const removeTask = useDashboardStore((state) => state.removeTask);
  const updateTask = useDashboardStore((state) => state.updateTask);

  const messageCount = task._count?.messages ?? 0;

  function handleChat() {
    setSelectedTask(task);
    setCurrentDashboardView(CurrentView.CHAT);
  }

  function handleRestore() {
    startRestoreTransition(async () => {
      const result = await restoreTask(task);
      if (result.success) {
        // Move the task out of trash in local store by updating its status
        updateTask({ ...task, status: "pending" });
        toast.success(`"${task.title}" restored to pending.`);
      } else {
        toast.error(result.error ?? "Failed to restore task.");
      }
    });
  }

  function handleDelete() {
    startDeleteTransition(async () => {
      const result = await deleteTask(task);
      if (result.success) {
        removeTask(task.id);
        toast.success(`"${task.title}" permanently deleted.`);
      } else {
        toast.error(result.error ?? "Failed to delete task.");
      }
    });
  }

  return (
    <Card className="my-2 w-full py-4 transition-all opacity-80 hover:opacity-100">
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="h-full -my-4">
        <p>
          <span className="text-primary">Description : </span>
          {task.description}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2 justify-end">
        {/* Delete — permanent */}
        <Button
          variant=""
          size="icon"
          className="mr-auto  hover:bg-destructive "
          onClick={handleDelete}
          disabled={isPendingDelete || isPendingRestore}
          title="Delete permanently"
        >
          <Trash2 className={isPendingDelete ? "animate-pulse" : ""} />
        </Button>

        {/* Restore to pending */}
        <Button
          variant=""
          size="icon"
          className="hover:bg-secondary hover:text-accent-foreground"
          onClick={handleRestore}
          disabled={isPendingRestore || isPendingDelete}
          title="Restore to pending"
        >
          <RotateCcw className={isPendingRestore ? "animate-spin" : ""} />
        </Button>

        {/* Open chat */}
        <Button
          variant=""
          size="icon"
          className="relative hover:bg-secondary hover:text-accent-foreground"
          onClick={handleChat}
          title="Open chat"
        >
          <MessageSquareText />
          {messageCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
              {messageCount > 99 ? "99+" : messageCount}
            </Badge>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function TrashPage() {
  const tasks = useDashboardStore((state) => state.tasks);

  const scrapedTasks = tasks.filter(
    (task) => task.status === "scraped"
  ) as TaskWithCount[];

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b shrink-0">
        <Trash2 className="text-muted-foreground" size={20} />
        <h2 className="text-lg font-semibold">Trash</h2>
        {scrapedTasks.length > 0 && (
          <Badge variant="secondary" className="ml-1">
            {scrapedTasks.length}
          </Badge>
        )}
        <p className="ml-auto text-sm text-muted-foreground">
          Scraped tasks — restore or permanently delete
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {scrapedTasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-muted-foreground">
            <Trash2 size={48} strokeWidth={1} />
            <p className="text-base font-medium">Trash is empty</p>
            <p className="text-sm">Scraped tasks will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {scrapedTasks.map((task) => (
              <TrashCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}