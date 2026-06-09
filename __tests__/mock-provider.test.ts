import { describe, it, expect } from "vitest";
import { mockProvider } from "@/lib/detection/providers/mock";

describe("mockProvider", () => {
  it("is deterministic — returns same result for any input", async () => {
    const r1 = await mockProvider.analyze("hello world");
    const r2 = await mockProvider.analyze("completely different text here for testing purposes");
    expect(JSON.stringify(r1)).toBe(JSON.stringify(r2));
  });

  it("conforms to AnalysisResult shape", async () => {
    const result = await mockProvider.analyze("test");
    expect(result.meta.provider).toBe("mock");
    expect(result.meta.version).toBeDefined();
    expect(result.meta.analyzedAt).toBeDefined();
    expect(typeof result.scores.aiLikelihood).toBe("number");
    expect(typeof result.scores.humanLikelihood).toBe("number");
    expect(["low", "medium", "high"]).toContain(result.scores.confidence);
    expect(["likely-human", "likely-ai", "mixed", "inconclusive"]).toContain(result.scores.verdict);
    expect(Array.isArray(result.breakdown)).toBe(true);
    expect(Array.isArray(result.sentences)).toBe(true);
    expect(typeof result.explanation.summary).toBe("string");
    expect(Array.isArray(result.limitations)).toBe(true);
    expect(typeof result.disclaimer).toBe("string");
  });

  it("ai + human likelihood sums to 100", async () => {
    const result = await mockProvider.analyze("any text");
    expect(result.scores.aiLikelihood + result.scores.humanLikelihood).toBe(100);
  });

  it("always returns fixed aiLikelihood of 72", async () => {
    const result = await mockProvider.analyze("anything at all");
    expect(result.scores.aiLikelihood).toBe(72);
  });
});
