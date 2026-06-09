export interface AnalysisResult {
  meta: {
    provider: "heuristic" | "mock" | "transformer";
    version: string;
    analyzedAt: string;
    wordCount: number;
    charCount: number;
    sentenceCount: number;
    reliable: boolean;
  };
  scores: {
    aiLikelihood: number;
    humanLikelihood: number;
    confidence: "low" | "medium" | "high";
    verdict: "likely-human" | "likely-ai" | "mixed" | "inconclusive";
  };
  breakdown: ScoreBreakdown[];
  sentences: SentenceAnalysis[];
  explanation: {
    summary: string;
    topSignals: string[];
    flaggedSentences: number[];
    reasons: string[];
  };
  limitations: string[];
  disclaimer: string;
}

export interface ScoreBreakdown {
  signal: string;
  label: string;
  score: number;
  weight: number;
  contribution: number;
  detail: string;
}

export interface SentenceAnalysis {
  index: number;
  text: string;
  score: number;
  flagged: boolean;
}

export interface DetectorProvider {
  name: string;
  analyze(text: string): Promise<AnalysisResult>;
}

export type SignalResult = {
  raw: number;
  normalized: number;
  detail: string;
};

export type SignalFn = (
  text: string,
  sentences: string[],
  tokens: string[]
) => SignalResult;
