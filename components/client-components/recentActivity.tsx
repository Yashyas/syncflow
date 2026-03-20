"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useClientDashboard } from "@/app/store/clientStore";

// ── Constants ─────────────────────────────────────────────────────────────────

const EXCLUDED = new Set(["scraped", "central_chat"]);

const STATUS_CONFIG: Record<
  string,
  { label: string; chartVar: string }
> = {
  pending:          { label: "Pending",     chartVar: "--chart-2" },
  in_progress:      { label: "In Progress", chartVar: "--chart-1" },
  for_verification: { label: "For Review",  chartVar: "--chart-3" },
  completed:        { label: "Completed",   chartVar: "--chaart-6" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns true if updatedAt is within 60s of createdAt — i.e. never touched */
function isJustCreated(createdAt: Date, updatedAt: Date): boolean {
  return Math.abs(updatedAt.getTime() - createdAt.getTime()) < 60_000;
}

/** Relative time label: "2h ago", "Yesterday", "3 days ago", etc. */
function relativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Group label for the date dividers */
function groupKey(date: Date): string {
  const now = new Date();
  const diffDays = Math.floor(
    (now.setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) /
      86_400_000,
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface ActivityEntry {
  id: string;
  title: string;
  status: string;
  type: "created" | "completed" | "updated";
  sortDate: Date;
  relTime: string;
  group: string;
}

// ── Dot ───────────────────────────────────────────────────────────────────────

function Dot({ type, status }: { type: ActivityEntry["type"]; status: string }) {
  const style: React.CSSProperties = {
    width: 8,
    height: 8,
    borderRadius: "50%",
    flexShrink: 0,
    marginTop: 4,
  };

  if (type === "created") {
    return <span style={{ ...style, background: "var(--color-border-secondary)" }} />;
  }
  if (type === "completed") {
    return <span style={{ ...style, background: "var(--chaart-6, #639922)" }} />;
  }
  // updated — use chart var colour
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      style={{
        ...style,
        background: cfg ? `var(${cfg.chartVar})` : "var(--color-border-secondary)",
      }}
    />
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function RecentActivity() {
  const tasks = useClientDashboard((s) => s.tasks);

  const { entries, isEmpty } = useMemo(() => {
    const eligible = tasks.filter((t) => !EXCLUDED.has(t.status as string));

    const entries: ActivityEntry[] = eligible.map((t) => {
      const createdAt = new Date(t.createdAt);
      const updatedAt = new Date(t.updatedAt);

      // Determine entry type
      const type: ActivityEntry["type"] = isJustCreated(createdAt, updatedAt)
        ? "created"
        : t.status === "completed"
        ? "completed"
        : "updated";

      // Use updatedAt for updated/completed, createdAt for brand-new tasks
      const sortDate = type === "created" ? createdAt : updatedAt;

      return {
        id: t.id,
        title: t.title,
        status: t.status as string,
        type,
        sortDate,
        relTime: relativeTime(sortDate),
        group: groupKey(sortDate),
      };
    });

    // Most recent first
    entries.sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());

    return { entries, isEmpty: entries.length === 0 };
  }, [tasks]);

  // Build grouped structure preserving sort order
  const groups = useMemo(() => {
    const seen = new Map<string, ActivityEntry[]>();
    for (const entry of entries) {
      if (!seen.has(entry.group)) seen.set(entry.group, []);
      seen.get(entry.group)!.push(entry);
    }
    return Array.from(seen.entries()); // [ [groupLabel, entries[]], ... ]
  }, [entries]);

  return (
    <Card className="w-full shadow-sm flex flex-col max-h-[80vh]" >
      <CardHeader className="pb-2 shrink-0">
        <CardTitle className="text-base font-semibold tracking-tight">
          Recent activity
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Latest updates on this project
        </p>
      </CardHeader>

      <CardContent className="overflow-y-auto pr-3 flex-1 pb-4">
        {isEmpty ? (
          <div className="flex items-center justify-center h-24">
            <p className="text-sm text-muted-foreground">No activity yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-0">
            {groups.map(([groupLabel, groupEntries], gi) => (
              <div key={groupLabel}>
                {/* ── Date divider ── */}
                <div className="flex items-center gap-2 mb-2 mt-3 first:mt-0">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest whitespace-nowrap">
                    {groupLabel}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                {/* ── Entries ── */}
                <div className="flex flex-col">
                  {groupEntries.map((entry, ei) => {
                    const isLast =
                      gi === groups.length - 1 &&
                      ei === groupEntries.length - 1;
                    const cfg = STATUS_CONFIG[entry.status];

                    return (
                      <div key={entry.id} className="flex gap-3">
                        {/* Timeline spine */}
                        <div className="flex flex-col items-center">
                          <Dot type={entry.type} status={entry.status} />
                          {!isLast && (
                            <div className="w-px flex-1 bg-border mt-1 mb-1" />
                          )}
                        </div>

                        {/* Content */}
                        <div
                          className={`flex items-start justify-between gap-2 w-full min-w-0 ${
                            !isLast ? "pb-3" : ""
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate leading-tight">
                              {entry.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {entry.type === "created"
                                ? "Added to project"
                                : entry.type === "completed"
                                ? "Marked as completed"
                                : "Task updated"}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0">
                            {/* Status badge — only for updated entries */}
                            {entry.type !== "created" && cfg && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] px-1.5 py-0 border-0 font-medium leading-5"
                                style={{
                                  backgroundColor: `color-mix(in oklch, var(${cfg.chartVar}) 15%, transparent)`,
                                  color: `var(${cfg.chartVar})`,
                                }}
                              >
                                {cfg.label}
                              </Badge>
                            )}
                            <span className="text-[10px] text-muted-foreground tabular-nums">
                              {entry.relTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}