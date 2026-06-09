import type { AnalysisResult } from "@/types";

interface LimitationsProps {
  result: AnalysisResult;
}

export function Limitations({ result }: LimitationsProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-[var(--ink)]">Limitations & Disclaimer</h2>
        <p className="text-xs text-[var(--muted)] mt-1">
          Read before acting on any result from this tool.
        </p>
      </div>

      <div
        className="rounded-xl border border-[var(--score-ai)] bg-[var(--score-ai-soft)] px-5 py-4 text-sm font-medium text-[var(--ink)] leading-relaxed"
        role="alert"
      >
        <p className="font-semibold mb-1">Disclaimer</p>
        <p>{result.disclaimer}</p>
      </div>

      <ul className="space-y-2.5" aria-label="Known limitations">
        {result.limitations.map((lim, i) => (
          <li key={i} className="flex gap-3 text-sm text-[var(--ink-soft)] leading-relaxed">
            <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-[var(--primary-50)] text-[var(--primary)] flex items-center justify-center text-xs font-bold">
              {i + 1}
            </span>
            {lim}
          </li>
        ))}
      </ul>
    </div>
  );
}
