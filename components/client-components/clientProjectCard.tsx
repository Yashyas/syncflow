"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, LogOut, Calendar, User2, Layers } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  useClientSessionStore,
  useClientDashboard,
  ClientView,
} from "@/app/store/clientStore";
import { MessageDrawer } from "./messageDrawer";

// ── Helpers ───────────────────────────────────────────────────────────────────

function initials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ClientProjectDisplay() {
  const router = useRouter();

  // ── Stores ──
  const project         = useClientSessionStore((s) => s.project);
  const clearProject    = useClientSessionStore((s) => s.clearProject);
  const tasks           = useClientDashboard((s) => s.tasks);
  const setSelectedTask = useClientDashboard((s) => s.setSelectedTask);
  const setView         = useClientDashboard((s) => s.setClientDashboardView);

  // ── Derived ──
  const centralChatTask = useMemo(
    () => tasks.find((t) => (t.status as string) === "central_chat") ?? null,
    [tasks],
  );

  const messageCount = centralChatTask?._count?.messages ?? 0;

  // Task counts (excluding central_chat)
  const visibleTasks = useMemo(
    () => tasks.filter((t) => (t.status as string) !== "central_chat"),
    [tasks],
  );
  const completedCount = visibleTasks.filter((t) => t.status === "completed").length;
  const totalCount     = visibleTasks.length;

  // ── Handlers ──
  function handleOpenChat() {
    if (!centralChatTask) return;
    setSelectedTask(centralChatTask);
    setView(ClientView.CHAT);
  }

  function handleLogout() {
    clearProject();
    router.push("/client");
  }

  if (!project) return null;

  const clientName     = project.client ?? "Client";
  const freelancerName = project.freelancer?.name ?? "Your freelancer";

  return (
    <TooltipProvider delayDuration={300}>
      <Card className="flex w-full lg:max-h-[40vh] flex-col overflow-hidden " >

        {/* ── Header: client identity + logout ── */}
        <div className="flex shrink-0 items-center justify-between border-b bg-muted/50 px-4 py-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="h-7 w-7 shrink-0 text-[11px]">
              <AvatarFallback className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                {initials(clientName)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-sm font-medium text-foreground">
              {clientName}
            </span>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-7 shrink-0 gap-1.5 px-2.5 text-[11px] text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-3 w-3" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="text-xs">
              Sign out
            </TooltipContent>
          </Tooltip>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex flex-col flex-1">
            <ScrollArea className=" overflow-y-auto">
          <CardContent className="p-2">

            {/* Project label + title */}
            <div className="space-y-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Project
              </p>
              <h2 className="text-base font-semibold leading-snug text-foreground break-words">
                {project.title ?? "Untitled project"}
              </h2>
            </div>

            {/* Description */}
                <p className="text-xs  text-muted-foreground ">
                    {project.description}
                </p>
          </CardContent>
          </ScrollArea>
          
          <CardFooter className="p-2 flex flex-col gap-2 mt-auto">
                        {/* Meta grid: freelancer, date, tasks */}
            <div className="flex gap-2 sm:flex-cols w-full">

              {/* Freelancer */}
              <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2.5 w-full">
                <User2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Freelancer
                  </p>
                  <p className="truncate text-xs font-medium text-foreground">
                    {freelancerName}
                  </p>
                </div>
              </div>

              {/* Started */}
              <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2.5 w-full">
                <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <div className="min-w-0">
                  <p className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Started
                  </p>
                  <p className="text-xs font-medium text-foreground">
                    {formatDate(project.createdAt)}
                  </p>
                </div>
              </div>
            </div>
             {/* Chat CTA */}
            <MessageDrawer>
              <Button
                onClick={handleOpenChat}
                disabled={!centralChatTask}
                className="w-full gap-2 "
                size="sm"
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0" />
                Open Project Chat
                {messageCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-auto h-5 min-w-5 rounded-full px-1.5 text-[10px] font-bold"
                  >
                    {messageCount > 99 ? "99+" : messageCount}
                  </Badge>
                )}
              </Button>
            </MessageDrawer>
          </CardFooter>
        </div>
      </Card>
    </TooltipProvider>
  );
}