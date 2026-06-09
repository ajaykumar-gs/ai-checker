import type { AnalysisResult } from "@/types";
import { Badge } from "@/components/ui/Badge";

const VERDICT_BADGE_VARIANT = {
  "likely-ai": "ai",
  "likely-human": "human",
  "mixed": "mixed",
  "inconclusive": "inconclusive",
} as const;

const VERDICT_LABEL = {
  "likely-ai": "Likely AI",
  "likely-human": "Likely Human",
  "mixed": "Mixed Signal",
  "inconclusive": "Inconclusive",
};

const CONFIDENCE_LABEL = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
};

interface ScoreCardProps {
  result: AnalysisResult;
}

export function ScoreCard({ result }: ScoreCardProps) {
  const { scores, meta } = result;
  const aiColor = "var(--score-ai)";
  const humanColor = "var(--score-human)";
  const mixedColor = "var(--score-mixed)";

  const barColor =
    scores.verdict === "likely-ai"
      ? aiColor
      : scores.verdict === "likely-human"
      ? humanColor
      : mixedColor;

  return (
    <div className="space-y-5">
      {/* Primary score display */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex-1">
          <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest mb-1">
            AI Likelihood
          </p>
          <p
            className="font-bold leading-none tracking-tight"
            style={{ fontSize: "clamp(48px, 8vw, 64px)", color: barColor }}
          >
            {scores.aiLikelihood}%
          </p>
          <p className="text-sm text-[var(--muted)] mt-1">
            Human likelihood: {scores.humanLikelihood}%
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2">
          <Badge variant={VERDICT_BADGE_VARIANT[scores.verdict]}>
            {VERDICT_LABEL[scores.verdict]}
          </Badge>
          <span className="text-xs text-[var(--muted)]">
            {CONFIDENCE_LABEL[scores.confidence]}
          </span>
          {!meta.reliable && (
            <span className="text-xs text-[var(--score-mixed)] font-medium">
              ⚠ Results unreliable — text too short or signals disagree
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div
          className="h-3 rounded-full overflow-hidden"
          style={{ backgroundColor: "var(--border)" }}
          role="progressbar"
          aria-valuenow={scores.aiLikelihood}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`AI likelihood: ${scores.aiLikelihood}%`}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${scores.aiLikelihood}%`, backgroundColor: barColor }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-[var(--score-human)] font-medium">Human</span>
          <span className="text-xs text-[var(--score-ai)] font-medium">AI</span>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-[var(--muted)]">
        <span>{meta.wordCount.toLocaleString()} words</span>
        <span>{meta.sentenceCount} sentences</span>
        <span>Provider: {meta.provider}</span>
        <span>v{meta.version}</span>
      </div>

      {/* Summary */}
      <p className="text-sm text-[var(--ink-soft)] leading-relaxed border-t border-[var(--border)] pt-4">
        {result.explanation.summary}
      </p>
    </div>
  );
}
