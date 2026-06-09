import type { AnalysisResult } from "@/types";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { ScoreCard } from "./ScoreCard";
import { SignalBreakdown } from "./SignalBreakdown";
import { SentenceAnalysis } from "./SentenceAnalysis";
import { Methodology } from "./Methodology";
import { Limitations } from "./Limitations";
import { ExportJson } from "./ExportJson";

interface ResultsDashboardProps {
  result: AnalysisResult;
}

export function ResultsDashboard({ result }: ResultsDashboardProps) {
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <div className="space-y-6">
          <ScoreCard result={result} />
          <SignalBreakdown breakdown={result.breakdown} />
        </div>
      ),
    },
    {
      id: "sentences",
      label: "Sentence Analysis",
      content: <SentenceAnalysis sentences={result.sentences} />,
    },
    {
      id: "methodology",
      label: "Methodology",
      content: <Methodology />,
    },
    {
      id: "limitations",
      label: "Limitations",
      content: <Limitations result={result} />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs text-[var(--muted)] flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Text is not stored. Analysis is stateless and runs entirely server-side without retention.
        </p>
        <ExportJson result={result} />
      </div>

      <Card>
        <Tabs tabs={tabs} defaultTab="overview" />
      </Card>

      <p className="text-xs text-[var(--muted)] text-center px-4">
        Assistive screening tool only. Results are probabilistic and must not be the sole basis for any accusation, academic penalty, or employment decision.
      </p>
    </div>
  );
}
