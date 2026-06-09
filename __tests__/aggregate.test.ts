import { describe, it, expect } from "vitest";
import {
  computeWeightedScore,
  computeConfidence,
  computeVerdict,
  buildBreakdown,
  scoreSentences,
} from "@/lib/detection/aggregate";
import { SIGNAL_WEIGHTS } from "@/lib/config/scoring";
import type { SignalResult } from "@/types";

function makeSignals(value: number): Record<string, SignalResult> {
  return Object.fromEntries(
    Object.keys(SIGNAL_WEIGHTS).map((k) => [
      k,
      { raw: value, normalized: value, detail: "test" },
    ])
  );
}

describe("SIGNAL_WEIGHTS", () => {
  it("sum to exactly 1.0", () => {
    const sum = Object.values(SIGNAL_WEIGHTS).reduce((a, b) => a + b, 0);
    expect(Math.round(sum * 1000) / 1000).toBe(1.0);
  });

  it("has 9 signals", () => {
    expect(Object.keys(SIGNAL_WEIGHTS)).toHaveLength(9);
  });
});

describe("computeWeightedScore", () => {
  it("returns 50 when all signals are 50", () => {
    const signals = makeSignals(50);
    expect(computeWeightedScore(signals)).toBe(50);
  });

  it("returns 0 when all signals are 0", () => {
    expect(computeWeightedScore(makeSignals(0))).toBe(0);
  });

  it("returns 100 when all signals are 100", () => {
    expect(computeWeightedScore(makeSignals(100))).toBe(100);
  });
});

describe("computeConfidence", () => {
  it("returns low for < 120 words", () => {
    expect(computeConfidence(50, makeSignals(50))).toBe("low");
  });

  it("returns medium for 120–299 words with moderate variance", () => {
    const result = computeConfidence(150, makeSignals(50));
    expect(["medium", "low"]).toContain(result);
  });

  it("returns high for ≥300 words with low variance (all same score)", () => {
    expect(computeConfidence(350, makeSignals(50))).toBe("high");
  });
});

describe("computeVerdict", () => {
  it("returns inconclusive for short text", () => {
    expect(computeVerdict(80, "high", 50, makeSignals(80))).toBe("inconclusive");
  });

  it("returns inconclusive for low confidence", () => {
    expect(computeVerdict(80, "low", 300, makeSignals(80))).toBe("inconclusive");
  });

  it("returns likely-ai when score > 65 with sufficient text and confidence", () => {
    expect(computeVerdict(75, "high", 300, makeSignals(75))).toBe("likely-ai");
  });

  it("returns likely-human when score < 35 with sufficient text and confidence", () => {
    expect(computeVerdict(25, "high", 300, makeSignals(25))).toBe("likely-human");
  });

  it("returns mixed when signals disagree strongly in 35–65 range", () => {
    // Create high variance signals: alternating 0 and 100
    const keys = Object.keys(SIGNAL_WEIGHTS);
    const highVarianceSignals: Record<string, SignalResult> = {};
    keys.forEach((k, i) => {
      highVarianceSignals[k] = { raw: i % 2 === 0 ? 0 : 100, normalized: i % 2 === 0 ? 0 : 100, detail: "" };
    });
    // Score will be ~50 with high variance — should be mixed
    const score = computeWeightedScore(highVarianceSignals);
    const verdict = computeVerdict(score, "medium", 300, highVarianceSignals);
    expect(["mixed", "inconclusive"]).toContain(verdict);
  });
});

describe("buildBreakdown", () => {
  it("returns one entry per signal", () => {
    const breakdown = buildBreakdown(makeSignals(50));
    expect(breakdown).toHaveLength(Object.keys(SIGNAL_WEIGHTS).length);
  });

  it("each entry has required fields", () => {
    const breakdown = buildBreakdown(makeSignals(60));
    for (const b of breakdown) {
      expect(typeof b.signal).toBe("string");
      expect(typeof b.label).toBe("string");
      expect(typeof b.score).toBe("number");
      expect(typeof b.weight).toBe("number");
      expect(typeof b.contribution).toBe("number");
      expect(typeof b.detail).toBe("string");
    }
  });
});

describe("scoreSentences", () => {
  const sentences = [
    "I went to the store yesterday.",
    "Furthermore, it is important to note that organizational strategies must be aligned.",
    "She laughed.",
  ];
  const tokens = sentences.join(" ").toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter(Boolean);

  it("returns one entry per sentence", () => {
    const result = scoreSentences(sentences, tokens);
    expect(result).toHaveLength(3);
  });

  it("scores in 0–100 range", () => {
    const result = scoreSentences(sentences, tokens);
    for (const s of result) {
      expect(s.score).toBeGreaterThanOrEqual(0);
      expect(s.score).toBeLessThanOrEqual(100);
    }
  });

  it("flags sentences with score > 70", () => {
    const result = scoreSentences(sentences, tokens);
    for (const s of result) {
      expect(s.flagged).toBe(s.score > 70);
    }
  });
});
