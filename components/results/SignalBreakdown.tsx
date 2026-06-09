"use client";

import { useState } from "react";
import type { ScoreBreakdown } from "@/types";

function scoreColor(score: number): string {
  if (score >= 65) return "var(--score-ai)";
  if (score <= 35) return "var(--score-human)";
  return "var(--score-mixed)";
}

interface SignalRowProps {
  breakdown: ScoreBreakdown;
}

function SignalRow({ breakdown }: SignalRowProps) {
  const [open, setOpen] = useState(false);
  const color = scoreColor(breakdown.score);

  return (
    <div className="border border-[var(--border)] rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--primary-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-sm font-semibold text-[var(--ink)] truncate">
              {breakdown.label}
            </span>
            <span
              className="text-sm font-bold tabular-nums shrink-0"
              style={{ color }}
            >
              {breakdown.score}/100
            </span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--border)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${breakdown.score}%`, backgroundColor: color }}
            />
          </div>
        </div>
        <svg
          className={`w-4 h-4 shrink-0 text-[var(--muted)] transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="px-4 pb-3 text-xs text-[var(--ink-soft)] leading-relaxed border-t border-[var(--border)] pt-3">
          <p>{breakdown.detail}</p>
          <p className="mt-2 text-[var(--muted)]">
            Weight: {(breakdown.weight * 100).toFixed(0)}% · Contribution: {breakdown.contribution.toFixed(1)} pts
          </p>
        </div>
      )}
    </div>
  );
}

interface SignalBreakdownProps {
  breakdown: ScoreBreakdown[];
}

export function SignalBreakdown({ breakdown }: SignalBreakdownProps) {
  const sorted = [...breakdown].sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-[var(--ink)]">Signal Breakdown</h2>
      <p className="text-xs text-[var(--muted)]">
        Each signal is scored 0–100 where higher values indicate AI-like patterns. Click a signal to see detail.
      </p>
      <div className="space-y-2">
        {sorted.map((b) => (
          <SignalRow key={b.signal} breakdown={b} />
        ))}
      </div>
    </div>
  );
}
