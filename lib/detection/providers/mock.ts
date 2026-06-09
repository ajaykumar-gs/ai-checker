import type { DetectorProvider, AnalysisResult } from "@/types";
import { DISCLAIMER, LIMITATIONS } from "@/lib/config/scoring";

// Deterministic fixed output for testing. Input text is intentionally ignored.
export const mockProvider: DetectorProvider = {
  name: "mock",
  async analyze(_text: string): Promise<AnalysisResult> {
    return {
      meta: {
        provider: "mock",
        version: "1.0.0",
        analyzedAt: "2024-01-01T00:00:00.000Z",
        wordCount: 200,
        charCount: 1200,
        sentenceCount: 10,
        reliable: true,
      },
      scores: {
        aiLikelihood: 72,
        humanLikelihood: 28,
        confidence: "medium",
        verdict: "likely-ai",
      },
      breakdown: [
        { signal: "burstiness", label: "Sentence Burstiness", score: 75, weight: 0.18, contribution: 13.5, detail: "Mock detail." },
        { signal: "perplexity", label: "Perplexity Proxy (approximation)", score: 70, weight: 0.16, contribution: 11.2, detail: "Mock detail. NOTE: approximation, not true perplexity." },
        { signal: "lexicalDiversity", label: "Lexical Diversity", score: 68, weight: 0.13, contribution: 8.8, detail: "Mock detail." },
        { signal: "ngramRepetition", label: "N-gram Repetition", score: 65, weight: 0.12, contribution: 7.8, detail: "Mock detail." },
        { signal: "sentenceVariance", label: "Sentence Length Variance", score: 72, weight: 0.11, contribution: 7.9, detail: "Mock detail." },
        { signal: "entropy", label: "Token Entropy Proxy", score: 60, weight: 0.10, contribution: 6.0, detail: "Mock detail." },
        { signal: "transitions", label: "Transition Phrase Density", score: 80, weight: 0.08, contribution: 6.4, detail: "Mock detail." },
        { signal: "repetition", label: "Word Repetition", score: 55, weight: 0.07, contribution: 3.85, detail: "Mock detail." },
        { signal: "syntacticUniformity", label: "Syntactic Uniformity", score: 70, weight: 0.05, contribution: 3.5, detail: "Mock detail." },
      ],
      sentences: [
        { index: 0, text: "This is mock sentence one.", score: 65, flagged: false },
        { index: 1, text: "Furthermore, this is mock sentence two.", score: 80, flagged: true },
      ],
      explanation: {
        summary: "Mock analysis result for testing purposes. This is deterministic and does not reflect actual text analysis.",
        topSignals: ["Transition Phrase Density (80/100)", "Sentence Burstiness (75/100)", "Sentence Length Variance (72/100)"],
        flaggedSentences: [1],
        reasons: ["High transition phrase density suggests AI patterns.", "Low burstiness suggests uniform output."],
      },
      limitations: LIMITATIONS,
      disclaimer: DISCLAIMER,
    };
  },
};
