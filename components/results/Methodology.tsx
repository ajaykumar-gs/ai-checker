"use client";

import { useState } from "react";

interface Section {
  title: string;
  content: string;
}

const SECTIONS: Section[] = [
  {
    title: "How the overall score is calculated",
    content:
      "The AI Likelihood score is a weighted sum of nine heuristic signals, each normalized to 0–100. Weights are configurable; default weights favor burstiness (18%) and perplexity proxy (16%) as the strongest indicators. The composite score is rounded to the nearest integer. Human likelihood is simply 100 minus AI likelihood.",
  },
  {
    title: "What each signal measures",
    content:
      "• Burstiness: std dev of sentence lengths. Uniform lengths suggest AI. \n" +
      "• Perplexity Proxy (approximation): common-word ratio and repetition — NOT true LM perplexity. \n" +
      "• Lexical Diversity: type-token ratio and MTLD-lite. Low diversity suggests AI. \n" +
      "• N-gram Repetition: repeated bi/tri-gram phrases. AI often echoes its own phrasing. \n" +
      "• Sentence Variance: variance (not std dev) of lengths. Complement to burstiness. \n" +
      "• Token Entropy: deviation from expected Shannon entropy range for natural English. \n" +
      "• Transition Density: over-use of discourse markers (furthermore, in conclusion…). \n" +
      "• Word Repetition: content words appearing 3+ times relative to vocabulary. \n" +
      "• Syntactic Uniformity: variety of sentence openers and punctuation rhythm.",
  },
  {
    title: "Verdict thresholds",
    content:
      "< 35% → Likely Human · > 65% → Likely AI · 35–65% with high signal disagreement → Mixed · " +
      "Input < 120 words OR low confidence → Inconclusive (reliability flag set). " +
      "Confidence is determined by input length (≥300 words for high) AND signal agreement (low variance across sub-scores).",
  },
  {
    title: "Sentence-level scoring",
    content:
      "Each sentence is scored using a subset of signals: length deviation from the document mean, presence of transition phrases, local word repetition within the sentence, and common-word ratio. Sentences scoring above 70 are flagged. This is a coarser signal than the document-level score.",
  },
  {
    title: "What this tool cannot do",
    content:
      "It cannot identify specific AI models. It cannot distinguish between AI-generated and AI-edited text. It cannot reliably screen short texts, code, non-English text, or heavily paraphrased content. It is not calibrated against any specific academic or professional AI detection standard.",
  },
];

export function Methodology() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-[var(--ink)]">How Scoring Works</h2>
      <p className="text-xs text-[var(--muted)]">
        Expand a section to understand the methodology behind each component.
      </p>
      <div className="space-y-2">
        {SECTIONS.map((s, i) => (
          <div key={i} className="border border-[var(--border)] rounded-xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-left text-[var(--ink)] hover:bg-[var(--primary-50)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)] transition-colors"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
            >
              {s.title}
              <svg
                className={`w-4 h-4 shrink-0 text-[var(--muted)] transition-transform ${open === i ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {open === i && (
              <div className="px-4 pb-4 pt-2 border-t border-[var(--border)] text-sm text-[var(--ink-soft)] leading-relaxed whitespace-pre-line">
                {s.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
