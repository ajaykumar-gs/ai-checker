import type { ScoreBreakdown, SentenceAnalysis } from "@/types";
import {
  SIGNAL_WEIGHTS,
  SIGNAL_LABELS,
  VERDICT_THRESHOLDS,
  CONFIDENCE,
  MIN_RELIABLE_WORDS,
  SENTENCE_FLAG_THRESHOLD,
  SENTENCE_SCORE_WEIGHTS,
} from "@/lib/config/scoring";
import type { SignalResult } from "@/types";

export type Verdict = "likely-human" | "likely-ai" | "mixed" | "inconclusive";
export type ConfidenceLevel = "low" | "medium" | "high";

export function computeWeightedScore(
  signalResults: Record<string, SignalResult>
): number {
  let total = 0;
  for (const [signal, result] of Object.entries(signalResults)) {
    const weight = SIGNAL_WEIGHTS[signal] ?? 0;
    total += result.normalized * weight;
  }
  return Math.round(total);
}

export function computeConfidence(
  wordCount: number,
  signalResults: Record<string, SignalResult>
): ConfidenceLevel {
  const scores = Object.values(signalResults).map((r) => r.normalized);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;

  if (wordCount < CONFIDENCE.mediumMinWords) return "low";
  if (wordCount >= CONFIDENCE.highMinWords && variance <= CONFIDENCE.highMaxVariance) return "high";
  if (wordCount >= CONFIDENCE.mediumMinWords && variance <= CONFIDENCE.highMaxVariance * 2) return "medium";
  return "low";
}

export function computeVerdict(
  aiLikelihood: number,
  confidence: ConfidenceLevel,
  wordCount: number,
  signalResults: Record<string, SignalResult>
): Verdict {
  if (wordCount < MIN_RELIABLE_WORDS || confidence === "low") return "inconclusive";

  const scores = Object.values(signalResults).map((r) => r.normalized);
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
  const highDisagreement = variance > CONFIDENCE.highMaxVariance;

  if (aiLikelihood < VERDICT_THRESHOLDS.likelyHuman) return "likely-human";
  if (aiLikelihood > VERDICT_THRESHOLDS.likelyAI) return "likely-ai";
  if (highDisagreement) return "mixed";
  return "inconclusive";
}

export function buildBreakdown(
  signalResults: Record<string, SignalResult>
): ScoreBreakdown[] {
  return Object.entries(signalResults).map(([signal, result]) => {
    const weight = SIGNAL_WEIGHTS[signal] ?? 0;
    return {
      signal,
      label: SIGNAL_LABELS[signal] ?? signal,
      score: result.normalized,
      weight,
      contribution: Math.round(result.normalized * weight * 10) / 10,
      detail: result.detail,
    };
  });
}

export function scoreSentences(
  sentences: string[],
  tokens: string[]
): SentenceAnalysis[] {
  const allLengths = sentences.map((s) => s.split(/\s+/).filter(Boolean).length);
  const meanLen = allLengths.reduce((a, b) => a + b, 0) / Math.max(1, allLengths.length);
  const stdLen = Math.sqrt(
    allLengths.reduce((a, b) => a + Math.pow(b - meanLen, 2), 0) / Math.max(1, allLengths.length)
  );

  const TRANSITION_PHRASES = [
    "furthermore", "moreover", "additionally", "in addition", "as a result",
    "consequently", "therefore", "thus", "hence", "in conclusion", "to summarize",
    "however", "nevertheless", "notably", "importantly", "in other words",
  ];

  const COMMON_WORDS = new Set([
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
    "for", "not", "on", "with", "as", "you", "do", "at", "this", "is",
    "are", "was", "were", "or", "an", "will", "all", "would", "there",
  ]);

  const globalTokenFreq: Record<string, number> = {};
  for (const t of tokens) globalTokenFreq[t] = (globalTokenFreq[t] ?? 0) + 1;

  return sentences.map((text, index) => {
    const sentTokens = text.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter(Boolean);
    const sentLen = sentTokens.length;

    // Length deviation from mean
    const lenDev = stdLen > 0 ? Math.min(1, Math.abs(sentLen - meanLen) / (stdLen * 2)) : 0;
    const lengthScore = 1 - lenDev; // near-mean → 1 (AI-like); outlier → 0

    // Transition presence
    const sentLower = text.toLowerCase();
    const hasTransition = TRANSITION_PHRASES.some((p) => sentLower.includes(p)) ? 1 : 0;

    // Local repetition (words appearing more than once in the sentence)
    const localFreq: Record<string, number> = {};
    for (const t of sentTokens) localFreq[t] = (localFreq[t] ?? 0) + 1;
    const localRepeat = Object.values(localFreq).filter((c) => c > 1).length;
    const localRepetitionScore = Math.min(1, localRepeat / Math.max(1, sentLen * 0.3));

    // Common word ratio
    const commonCount = sentTokens.filter((t) => COMMON_WORDS.has(t)).length;
    const commonRatio = sentLen > 0 ? commonCount / sentLen : 0;
    const commonScore = Math.min(1, commonRatio / 0.5);

    const raw =
      lengthScore * SENTENCE_SCORE_WEIGHTS.lengthDeviation +
      hasTransition * SENTENCE_SCORE_WEIGHTS.transitionPresence +
      localRepetitionScore * SENTENCE_SCORE_WEIGHTS.localRepetition +
      commonScore * SENTENCE_SCORE_WEIGHTS.commonWordRatio;

    const score = Math.round(Math.min(100, raw * 100));

    return {
      index,
      text,
      score,
      flagged: score > SENTENCE_FLAG_THRESHOLD,
    };
  });
}
