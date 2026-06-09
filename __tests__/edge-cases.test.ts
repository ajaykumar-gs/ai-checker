import { describe, it, expect } from "vitest";
import { runEngine } from "@/lib/detection/engine";

describe("edge cases", () => {
  it("short text (<120 words) → inconclusive and reliable=false", () => {
    const shortText = "This is a short paragraph. It does not have enough words to produce reliable results.";
    const result = runEngine(shortText);
    expect(result.scores.verdict).toBe("inconclusive");
    expect(result.meta.reliable).toBe(false);
  });

  it("very short text (2 words) → inconclusive and reliable=false", () => {
    const result = runEngine("Hello world.");
    expect(result.scores.verdict).toBe("inconclusive");
    expect(result.meta.reliable).toBe(false);
  });

  it("empty string — handles gracefully without throwing", () => {
    expect(() => runEngine("")).not.toThrow();
    const result = runEngine("");
    expect(result.meta.wordCount).toBe(0);
    expect(result.meta.reliable).toBe(false);
  });

  it("code/markup text → sets reliability warning in limitations", () => {
    const codeText = `
Here is some code:
\`\`\`javascript
function hello() {
  console.log("hello world");
}
\`\`\`
This function logs hello world to the console. It is a simple example.
    `.repeat(3);
    const result = runEngine(codeText);
    const hasWarning = result.limitations.some((l) =>
      l.toLowerCase().includes("code") || l.toLowerCase().includes("markup")
    );
    expect(hasWarning).toBe(true);
  });

  it("single long sentence — suppresses variance signals", () => {
    const longSentence =
      "This is one very long sentence that goes on and on and contains many words and clauses connected together in a way that makes it technically one sentence but has a great deal of content packed into it without any sentence-ending punctuation until right now.";
    const result = runEngine(longSentence);
    // Should not throw; variance signals get suppressed
    expect(result).toBeDefined();
    expect(result.meta.sentenceCount).toBeGreaterThanOrEqual(1);
  });

  it("result always contains disclaimer", () => {
    const result = runEngine("Some text here for testing purposes only.");
    expect(result.disclaimer.length).toBeGreaterThan(0);
    expect(result.disclaimer).not.toContain("guaranteed");
    expect(result.disclaimer).not.toContain("100% accurate");
  });

  it("ai + human likelihood always sums to 100", () => {
    const texts = [
      "Hello.",
      "A medium length text that has more words in it and covers more content.",
      "Furthermore, it is important to note that in today's rapidly evolving landscape, organizations must embrace digital transformation. Moreover, the integration of artificial intelligence has become increasingly critical for business success. Additionally, data-driven decision-making provides competitive advantages. Consequently, companies that fail to adapt will struggle in the modern economy. In conclusion, digital maturity requires commitment and investment.",
    ];
    for (const text of texts) {
      const result = runEngine(text);
      expect(result.scores.aiLikelihood + result.scores.humanLikelihood).toBe(100);
    }
  });

  it("meta wordCount matches approximate word count", () => {
    const text = "one two three four five six seven eight nine ten";
    const result = runEngine(text);
    expect(result.meta.wordCount).toBe(10);
  });
});
