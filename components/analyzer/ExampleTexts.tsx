"use client";

import { SAMPLE_TEXTS } from "@/data/samples";

const CATEGORY_LABELS: Record<string, string> = {
  "clearly-human": "Human",
  "clearly-ai": "AI",
  "mixed": "Mixed",
  "paraphrased": "Paraphrased",
  "short-edge-case": "Short",
};

interface ExampleTextsProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export function ExampleTexts({ onSelect, disabled }: ExampleTextsProps) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-[var(--muted)] uppercase tracking-widest">
        Try an example
      </p>
      <div className="flex flex-wrap gap-2">
        {SAMPLE_TEXTS.map((sample) => (
          <button
            key={sample.id}
            onClick={() => onSelect(sample.text)}
            disabled={disabled}
            className="px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-xs font-medium text-[var(--ink-soft)] hover:border-[var(--primary-400)] hover:text-[var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <span className="text-[var(--muted)]">[{CATEGORY_LABELS[sample.category]}]</span>{" "}
            {sample.label}
          </button>
        ))}
      </div>
    </div>
  );
}
