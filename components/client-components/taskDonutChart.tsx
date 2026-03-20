"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useClientDashboard } from "@/app/store/clientStore";

enum TaskStatus {
  pending = "pending",
  in_progress = "in_progress",
  for_verification = "for_verification",
  completed = "completed",
}

const STAGES: {
  key: TaskStatus;
  label: string;
  chartVar: string;
}[] = [
  { key: TaskStatus.pending,          label: "Pending",     chartVar: "--chart-2" },
  { key: TaskStatus.in_progress,      label: "In Progress", chartVar: "--chart-1" },
  { key: TaskStatus.for_verification, label: "For Review",  chartVar: "--chart-4" },
  { key: TaskStatus.completed,        label: "Completed",   chartVar: "--chart-6" },
];

function useResolvedChartColors(vars: string[]): string[] {
  const fallbacks = ["#f59e0b", "#3b82f6", "#a855f7", "#22c55e"];

  const resolve = () =>
    vars.map((v, i) => {
      if (typeof window === "undefined") return fallbacks[i];
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue(v)
        .trim();
      return raw || fallbacks[i];
    });

  const [colors, setColors] = useState<string[]>(fallbacks);

  useEffect(() => {
    setColors(resolve());
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setColors(resolve());
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return colors;
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { color: string } }[];
}) => {
  if (active && payload?.length) {
    const { name, value, payload: p } = payload[0];
    return (
      <div className="rounded-lg border bg-background px-3 py-2 shadow-md text-sm">
        <span className="font-medium" style={{ color: p.color }}>
          {name}
        </span>
        <span className="ml-2 text-muted-foreground font-semibold">
          {value} task{value !== 1 ? "s" : ""}
        </span>
      </div>
    );
  }
  return null;
};

export default function TaskDonutChart() {
  const tasks = useClientDashboard((s) => s.tasks);

  const resolvedColors = useResolvedChartColors(STAGES.map((s) => s.chartVar));

  // Count per stage
  const counts = STAGES.reduce(
    (acc, stage) => {
      acc[stage.key] = tasks.filter(
        (t) => (t.status as string) === stage.key,
      ).length;
      return acc;
    },
    {} as Record<TaskStatus, number>,
  );

  const total = STAGES.reduce((sum, s) => sum + counts[s.key], 0);

  const chartData =
    total === 0
      ? [{ name: "No tasks", value: 1, color: "var(--muted)" }]
      : STAGES.filter((s) => counts[s.key] > 0).map((s, i) => ({
          name: s.label,
          value: counts[s.key],
          color: resolvedColors[i],
        }));

  return (
    <Card className="w-full md:max-w-[33vw] shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold tracking-tight">
          Task Overview
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Distribution across active stages
        </p>
      </CardHeader>

      <CardContent className="flex flex-col lg:flex-row items-center gap-5">
        {/* ── Donut ── */}
        <div className="relative h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={82}
                paddingAngle={total === 0 ? 0 : 3}
                dataKey="value"
                strokeWidth={0}
                startAngle={90}
                endAngle={-270}
              >
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Centre label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold tabular-nums leading-none">
              {total}
            </span>
            <span className="mt-1 text-[11px] font-medium text-muted-foreground uppercase tracking-widest">
              Total
            </span>
          </div>
        </div>

        {/* ── Legend ── */}
        <div className="grid w-full grid-cols-1 gap-2">
          {STAGES.map((stage, i) => (
            <div
              key={stage.key}
              className="flex items-center justify-between rounded-lg px-3 py-2"
              style={{
                backgroundColor: `color-mix(in oklch, var(${stage.chartVar}) 15%, transparent)`,
              }}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: `var(${stage.chartVar})` }}
                />
                <span
                  className="text-xs font-medium truncate"
                  style={{ color: `var(${stage.chartVar})` }}
                >
                  {stage.label}
                </span>
              </div>

              <Badge
                variant="secondary"
                className="ml-2 shrink-0 text-xs font-bold px-1.5 border-0"
                style={{
                  backgroundColor: `color-mix(in oklch, var(${stage.chartVar}) 25%, transparent)`,
                  color: `var(${stage.chartVar})`,
                }}
              >
                {counts[stage.key]}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}