export const SIGNAL_WEIGHTS: Record<string, number> = {
  burstiness: 0.18,
  perplexity: 0.16,
  lexicalDiversity: 0.13,
  ngramRepetition: 0.12,
  sentenceVariance: 0.11,
  entropy: 0.10,
  transitions: 0.08,
  repetition: 0.07,
  syntacticUniformity: 0.05,
};

export const SIGNAL_LABELS: Record<string, string> = {
  burstiness: "Sentence Burstiness",
  perplexity: "Perplexity Proxy (approximation)",
  lexicalDiversity: "Lexical Diversity",
  ngramRepetition: "N-gram Repetition",
  sentenceVariance: "Sentence Length Variance",
  entropy: "Token Entropy Proxy",
  transitions: "Transition Phrase Density",
  repetition: "Word Repetition",
  syntacticUniformity: "Syntactic Uniformity",
};

export const VERDICT_THRESHOLDS = {
  likelyHuman: 35,
  likelyAI: 65,
} as const;

export const CONFIDENCE = {
  highMinWords: 300,
  highMaxVariance: 400,
  mediumMinWords: 120,
} as const;

export const MIN_RELIABLE_WORDS = 120;

export const SENTENCE_FLAG_THRESHOLD = 70;

export const SENTENCE_SCORE_WEIGHTS = {
  lengthDeviation: 0.3,
  transitionPresence: 0.25,
  localRepetition: 0.25,
  commonWordRatio: 0.2,
} as const;

export const DISCLAIMER =
  "This is an assistive screening tool, not proof of AI authorship. " +
  "Heuristic detectors produce false positives and false negatives. " +
  "Results must NOT be the sole basis for any accusation, academic penalty, or employment decision.";

export const LIMITATIONS = [
  "Heuristic signals are statistical proxies, not ground-truth classifiers. False positives and false negatives are expected.",
  "Short texts (< 120 words) are especially unreliable; results are marked inconclusive.",
  "Paraphrased, lightly edited, or mixed-authorship text is particularly difficult to classify correctly.",
  "The 'perplexity' signal is a local approximation, not true language-model perplexity.",
  "Non-English text will produce degraded, unreliable results.",
  "Code blocks, markup, or highly technical content may inflate AI-likelihood scores artificially.",
  "Well-written human text can score as AI-like; poorly written AI text can score as human-like.",
  "This tool provides a probabilistic screening signal only. Do not treat any result as conclusive evidence.",
];
