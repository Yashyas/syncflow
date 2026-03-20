"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClientDashboard } from "@/app/store/clientStore";

const SCORE: Record<string, number> = {
  pending:          0,
  in_progress:      33,
  for_verification: 75,
  completed:        100,
  // scraped & central_chat are excluded entirely
};

const EXCLUDED = new Set(["scraped", "central_chat"]);


const BREAKDOWN = [
  { key: "completed",        label: "Completed",   chartVar: "--chart-6", score: 100 },
  { key: "for_verification", label: "For Review",  chartVar: "--chart-4", score: 75  },
  { key: "in_progress",      label: "In Progress", chartVar: "--chart-1", score: 33  },
  { key: "pending",          label: "Pending",     chartVar: "--chart-2", score: 0   },
];

function arcProps(pct: number, r: number) {
  const circ = 2 * Math.PI * r;
  return {
    strokeDasharray: `${circ}`,
    strokeDashoffset: `${circ - (circ * Math.min(pct, 100)) / 100}`,
  };
}

export default function ProjectCompletion() {
  const tasks = useClientDashboard((s) => s.tasks);

  const { pct, totalScore, maxScore, counts } = useMemo(() => {
    const eligible = tasks.filter((t) => !EXCLUDED.has(t.status as string));

    const totalScore = eligible.reduce(
      (sum, t) => sum + (SCORE[t.status as string] ?? 0),
      0,
    );
    const maxScore = eligible.length * 100;
    const pct = maxScore === 0 ? 0 : (totalScore / maxScore) * 100;

    const counts = BREAKDOWN.reduce(
      (acc, b) => {
        acc[b.key] = eligible.filter((t) => (t.status as string) === b.key).length;
        return acc;
      },
      {} as Record<string, number>,
    );

    return { pct, totalScore, maxScore, counts, total: eligible.length };
  }, [tasks]);

  const displayPct = Math.round(pct * 10) / 10; // 1 decimal place

  const arcColor =
    pct >= 100
      ? "var(--chart-6)"  
      : pct >= 60
      ? "var(--chart-1)"   
      : pct >= 25
      ? "var(--chart-2)"   
      : "var(--chart-4)";  

  const SIZE = 160;
  const STROKE = 12;
  const R = (SIZE - STROKE) / 2;
  const { strokeDasharray, strokeDashoffset } = arcProps(pct, R);

  return (
    <Card className="w-full md:max-w-[33vw]  shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold tracking-tight">
          Project Completion
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Weighted score across all active tasks
        </p>
      </CardHeader>

      <CardContent className="flex flex-col lg:flex-row items-center gap-6">

        {/* ── Arc gauge ── */}
        <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            style={{ transform: "rotate(-90deg)" }}
          >
            {/* Track */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke="currentColor"
              strokeWidth={STROKE}
              className="text-muted/30"
              strokeLinecap="round"
            />
            {/* Progress */}
            <circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              fill="none"
              stroke={arcColor}
              strokeWidth={STROKE}
              strokeLinecap="round"
              style={{
                strokeDasharray,
                strokeDashoffset,
                transition: "stroke-dashoffset 0.8s ease, stroke 0.4s ease",
              }}
            />
          </svg>

          {/* Centre text */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-2xl font-bold tabular-nums leading-none"
              style={{ color: arcColor }}
            >
              {displayPct}%
            </span>
            <span className="mt-1 text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
              Complete
            </span>
          </div>
        </div>

        {/* ── Breakdown ── */}
        <div className="flex flex-col gap-2 w-full">
          {BREAKDOWN.map((b) => {
            const count = counts[b.key] ?? 0;
            const contribution = count * b.score;
            const rowPct = maxScore === 0 ? 0 : (contribution / maxScore) * 100;

            return (
              <div key={b.key} className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: `var(${b.chartVar})` }}
                    />
                    <span className="text-[11px] font-medium text-muted-foreground truncate">
                      {b.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-[11px] text-muted-foreground tabular-nums">
                      {count}×
                    </span>
                    <span
                      className="text-[11px] font-semibold tabular-nums"
                      style={{ color: `var(${b.chartVar})` }}
                    >
                      {b.score}pts
                    </span>
                  </div>
                </div>

                {/* Mini progress bar */}
                <div className="h-1 w-full rounded-full bg-muted/40 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${rowPct}%`,
                      backgroundColor: `var(${b.chartVar})`,
                    }}
                  />
                </div>
              </div>
            );
          })}

          {/* Totals */}
          <div className="mt-1 flex items-center justify-between border-t pt-2">
            <span className="text-[11px] text-muted-foreground">Total score</span>
            <span className="text-[11px] font-semibold tabular-nums text-foreground">
              {totalScore} / {maxScore}
            </span>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}