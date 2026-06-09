import type { SentenceAnalysis as SentenceAnalysisType } from "@/types";

interface SentenceAnalysisProps {
  sentences: SentenceAnalysisType[];
}

export function SentenceAnalysis({ sentences }: SentenceAnalysisProps) {
  const flaggedCount = sentences.filter((s) => s.flagged).length;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-[var(--ink)]">Sentence Analysis</h2>
        <p className="text-xs text-[var(--muted)] mt-1">
          Highlight intensity scales with AI-like score per sentence.{" "}
          <span className="font-medium" style={{ color: "var(--score-ai)" }}>
            {flaggedCount} sentence{flaggedCount !== 1 ? "s" : ""} flagged
          </span>{" "}
          (score &gt; 70). Flagged sentences are probabilistic indicators only.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] p-5 text-[15px] leading-relaxed text-[var(--ink)] space-y-0.5">
        {sentences.map((s) => (
          <span
            key={s.index}
            className="sentence-highlight"
            style={
              {
                "--score": s.score,
                cursor: "default",
              } as React.CSSProperties
            }
            title={`Sentence ${s.index + 1}: ${s.score}/100${s.flagged ? " (flagged)" : ""}`}
            aria-label={`Sentence ${s.index + 1}, AI-like score ${s.score} out of 100${s.flagged ? ", flagged" : ""}`}
          >
            {s.text}{" "}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-3 rounded" style={{ background: "transparent", border: "1px solid var(--border)" }} />
          <span>Low (human-like)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-3 rounded" style={{ backgroundColor: "color-mix(in srgb, var(--score-ai) 30%, transparent)" }} />
          <span>Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-3 rounded" style={{ backgroundColor: "color-mix(in srgb, var(--score-ai) 60%, transparent)" }} />
          <span>High (AI-like)</span>
        </div>
      </div>
    </div>
  );
}
