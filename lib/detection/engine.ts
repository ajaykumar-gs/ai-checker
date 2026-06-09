import type { SignalResult } from "@/types";
import { segmentSentences, countWords } from "@/lib/text/segment";
import { tokenize, hasCodeOrMarkup, likelyNonEnglish } from "@/lib/text/preprocess";
import {
  burstiness,
  perplexity,
  lexicalDiversity,
  ngramRepetition,
  sentenceVariance,
  entropy,
  transitions,
  repetition,
  syntacticUniformity,
} from "@/lib/detection/signals";
import {
  computeWeightedScore,
  computeConfidence,
  computeVerdict,
  buildBreakdown,
  scoreSentences,
} from "@/lib/detection/aggregate";
import {
  DISCLAIMER,
  LIMITATIONS,
  MIN_RELIABLE_WORDS,
  SIGNAL_LABELS,
} from "@/lib/config/scoring";
import type { AnalysisResult } from "@/types";

const SIGNAL_FNS = [
  { key: "burstiness", fn: burstiness },
  { key: "perplexity", fn: perplexity },
  { key: "lexicalDiversity", fn: lexicalDiversity },
  { key: "ngramRepetition", fn: ngramRepetition },
  { key: "sentenceVariance", fn: sentenceVariance },
  { key: "entropy", fn: entropy },
  { key: "transitions", fn: transitions },
  { key: "repetition", fn: repetition },
  { key: "syntacticUniformity", fn: syntacticUniformity },
] as const;

export function runEngine(text: string): AnalysisResult {
  const sentences = segmentSentences(text);
  const tokens = tokenize(text);
  const wordCount = countWords(text);
  const charCount = text.length;
  const sentenceCount = sentences.length;

  const activeWarnings: string[] = [];

  if (hasCodeOrMarkup(text)) {
    activeWarnings.push(
      "Code blocks or markup detected. Reliability may be degraded — heuristics are calibrated for prose."
    );
  }

  if (likelyNonEnglish(tokens)) {
    activeWarnings.push(
      "Text may not be English. Signals are calibrated for English prose; results are unreliable for other languages."
    );
  }

  // Run all signals
  const signalResults: Record<string, SignalResult> = {};
  for (const { key, fn } of SIGNAL_FNS) {
    signalResults[key] = fn(text, sentences, tokens);
  }

  // Suppress variance signals for single-sentence input
  if (sentences.length === 1) {
    signalResults.burstiness = { ...signalResults.burstiness, normalized: 50 };
    signalResults.sentenceVariance = { ...signalResults.sentenceVariance, normalized: 50 };
    signalResults.syntacticUniformity = { ...signalResults.syntacticUniformity, normalized: 50 };
  }

  const aiLikelihood = computeWeightedScore(signalResults);
  const humanLikelihood = 100 - aiLikelihood;
  const confidence = computeConfidence(wordCount, signalResults);
  const verdict = computeVerdict(aiLikelihood, confidence, wordCount, signalResults);
  const reliable = wordCount >= MIN_RELIABLE_WORDS && confidence !== "low";

  const breakdown = buildBreakdown(signalResults);
  const sentenceAnalyses = scoreSentences(sentences, tokens);
  const flaggedSentences = sentenceAnalyses.filter((s) => s.flagged).map((s) => s.index);

  // Top signals by normalized score
  const sortedSignals = [...breakdown].sort((a, b) => b.score - a.score);
  const topSignals = sortedSignals.slice(0, 3).map(
    (b) => `${b.label} (${b.score}/100)`
  );

  // Human-readable reasons
  const reasons: string[] = [];
  for (const b of sortedSignals.slice(0, 5)) {
    if (b.score > 60) {
      reasons.push(`High ${b.label.toLowerCase()} score (${b.score}/100) suggests AI patterns.`);
    }
  }
  for (const b of sortedSignals.slice(-3)) {
    if (b.score < 35) {
      reasons.push(`Low ${b.label.toLowerCase()} score (${b.score}/100) suggests human patterns.`);
    }
  }

  const summary = buildSummary(verdict, aiLikelihood, wordCount, reliable);

  const limitations = [
    ...activeWarnings,
    ...LIMITATIONS,
  ];

  return {
    meta: {
      provider: "heuristic",
      version: "1.0.0",
      analyzedAt: new Date().toISOString(),
      wordCount,
      charCount,
      sentenceCount,
      reliable,
    },
    scores: {
      aiLikelihood,
      humanLikelihood,
      confidence,
      verdict,
    },
    breakdown,
    sentences: sentenceAnalyses,
    explanation: {
      summary,
      topSignals,
      flaggedSentences,
      reasons: reasons.length > 0 ? reasons : ["No dominant signals; result is inconclusive."],
    },
    limitations,
    disclaimer: DISCLAIMER,
  };
}

function buildSummary(
  verdict: string,
  aiLikelihood: number,
  wordCount: number,
  reliable: boolean
): string {
  if (!reliable || wordCount < MIN_RELIABLE_WORDS) {
    return `Text is too short (${wordCount} words) for reliable analysis. Results are inconclusive — provide at least 120 words for a meaningful screening.`;
  }
  const pct = aiLikelihood;
  switch (verdict) {
    case "likely-ai":
      return `Analysis suggests this text is likely AI-generated (${pct}% AI likelihood). Multiple signals indicate patterns consistent with large-language-model output. This is a probabilistic screening result, not a definitive verdict.`;
    case "likely-human":
      return `Analysis suggests this text is likely human-written (${pct}% AI likelihood). Signals indicate natural variation and diversity typical of human authorship. This is a probabilistic screening result, not a definitive verdict.`;
    case "mixed":
      return `Signals disagree significantly (${pct}% AI likelihood). The text may be a mix of human and AI writing, or may have been edited/paraphrased. Results are inconclusive.`;
    default:
      return `Analysis is inconclusive (${pct}% AI likelihood). Signals do not strongly favor either human or AI authorship. Longer, unedited text produces more reliable results.`;
  }
}
