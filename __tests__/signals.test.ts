import { describe, it, expect } from "vitest";
import { burstiness } from "@/lib/detection/signals/burstiness";
import { perplexity } from "@/lib/detection/signals/perplexity";
import { lexicalDiversity } from "@/lib/detection/signals/lexicalDiversity";
import { ngramRepetition } from "@/lib/detection/signals/ngramRepetition";
import { sentenceVariance } from "@/lib/detection/signals/sentenceVariance";
import { entropy } from "@/lib/detection/signals/entropy";
import { transitions } from "@/lib/detection/signals/transitions";
import { repetition } from "@/lib/detection/signals/repetition";
import { syntacticUniformity } from "@/lib/detection/signals/syntacticUniformity";
import { tokenize } from "@/lib/text/preprocess";
import { segmentSentences } from "@/lib/text/segment";

const AI_TEXT = `In today's rapidly evolving landscape, organizations must embrace digital transformation. Furthermore, the integration of artificial intelligence has become increasingly important. Moreover, businesses need to leverage data-driven insights. Additionally, companies must develop robust strategic frameworks. It is worth noting that innovation is critical for long-term success. In conclusion, digital maturity requires comprehensive planning and execution.`;

const HUMAN_TEXT = `I woke up late. Again. The coffee machine was broken — not the dramatic kind of broken where something explodes, just the quiet kind where it makes a sad gurgling noise and produces nothing useful. I had to leave in twenty minutes, so I grabbed my coat and walked three blocks to the diner on Fifth, the one with the sticky menus and the waitress who always looks like she's been awake since 1987. She poured my coffee before I sat down. I love that place.`;

const SHORT_TEXT = "Hello world. This is short.";

function prep(text: string) {
  return {
    sentences: segmentSentences(text),
    tokens: tokenize(text),
  };
}

describe("burstiness signal", () => {
  it("returns lower score (more human-like) for varied sentence lengths", () => {
    const { sentences, tokens } = prep(HUMAN_TEXT);
    const result = burstiness(HUMAN_TEXT, sentences, tokens);
    expect(result.normalized).toBeGreaterThanOrEqual(0);
    expect(result.normalized).toBeLessThanOrEqual(100);
    expect(result.raw).toBeGreaterThan(0);
  });

  it("returns higher score for uniform sentence lengths (AI-like)", () => {
    const uniform = "The cat sat on the mat. The dog lay on the rug. The bird flew through air. The fish swam in water. The mouse ran in maze.";
    const { sentences, tokens } = prep(uniform);
    const result = burstiness(uniform, sentences, tokens);
    expect(result.normalized).toBeGreaterThan(50);
  });

  it("handles single sentence gracefully", () => {
    const { sentences, tokens } = prep(SHORT_TEXT);
    const result = burstiness(SHORT_TEXT, sentences, tokens);
    expect(result.normalized).toBeGreaterThanOrEqual(0);
    expect(result.normalized).toBeLessThanOrEqual(100);
  });
});

describe("perplexity signal", () => {
  it("is labeled as approximation in detail string", () => {
    const { sentences, tokens } = prep(AI_TEXT);
    const result = perplexity(AI_TEXT, sentences, tokens);
    expect(result.detail.toLowerCase()).toContain("approximation");
  });

  it("returns value in 0–100 range", () => {
    const { sentences, tokens } = prep(AI_TEXT);
    const result = perplexity(AI_TEXT, sentences, tokens);
    expect(result.normalized).toBeGreaterThanOrEqual(0);
    expect(result.normalized).toBeLessThanOrEqual(100);
  });

  it("handles empty tokens gracefully", () => {
    const result = perplexity("", [], []);
    expect(result.normalized).toBe(50);
  });
});

describe("lexicalDiversity signal", () => {
  it("returns higher diversity score (lower AI signal) for varied vocabulary", () => {
    const varied = HUMAN_TEXT;
    const { sentences, tokens } = prep(varied);
    const result = lexicalDiversity(varied, sentences, tokens);
    // Varied text should score lower on AI-likelihood
    expect(result.normalized).toBeLessThan(80);
  });

  it("returns normalized in 0–100", () => {
    const { sentences, tokens } = prep(AI_TEXT);
    const result = lexicalDiversity(AI_TEXT, sentences, tokens);
    expect(result.normalized).toBeGreaterThanOrEqual(0);
    expect(result.normalized).toBeLessThanOrEqual(100);
  });
});

describe("ngramRepetition signal", () => {
  it("detects high repetition in repetitive text", () => {
    const rep = "the quick brown fox. the quick brown fox jumped. the quick brown fox ran away. the quick brown fox sat down.";
    const { sentences, tokens } = prep(rep);
    const result = ngramRepetition(rep, sentences, tokens);
    expect(result.normalized).toBeGreaterThan(20);
  });

  it("returns 0 for too-few tokens", () => {
    const result = ngramRepetition("hi", ["hi"], ["hi"]);
    expect(result.normalized).toBe(0);
  });

  it("returns normalized in 0–100", () => {
    const { sentences, tokens } = prep(AI_TEXT);
    const result = ngramRepetition(AI_TEXT, sentences, tokens);
    expect(result.normalized).toBeGreaterThanOrEqual(0);
    expect(result.normalized).toBeLessThanOrEqual(100);
  });
});

describe("sentenceVariance signal", () => {
  it("returns high score for uniform sentences", () => {
    const uniform = "I go now. You go now. We go now. They go now. She goes now.";
    const { sentences, tokens } = prep(uniform);
    const result = sentenceVariance(uniform, sentences, tokens);
    expect(result.normalized).toBeGreaterThan(50);
  });

  it("returns lower score for varied lengths", () => {
    const { sentences, tokens } = prep(HUMAN_TEXT);
    const result = sentenceVariance(HUMAN_TEXT, sentences, tokens);
    expect(result.normalized).toBeLessThan(80);
  });

  it("handles single sentence gracefully", () => {
    const result = sentenceVariance("One sentence only.", ["One sentence only."], ["one", "sentence", "only"]);
    expect(result.normalized).toBeGreaterThanOrEqual(0);
    expect(result.normalized).toBeLessThanOrEqual(100);
  });
});

describe("entropy signal", () => {
  it("returns normalized in 0–100", () => {
    const { sentences, tokens } = prep(AI_TEXT);
    const result = entropy(AI_TEXT, sentences, tokens);
    expect(result.normalized).toBeGreaterThanOrEqual(0);
    expect(result.normalized).toBeLessThanOrEqual(100);
  });

  it("returns 50 for too-few tokens", () => {
    const result = entropy("hi", [], ["hi"]);
    expect(result.normalized).toBe(50);
  });
});

describe("transitions signal", () => {
  it("detects high transition density in AI text", () => {
    const { sentences, tokens } = prep(AI_TEXT);
    const result = transitions(AI_TEXT, sentences, tokens);
    expect(result.normalized).toBeGreaterThan(40);
  });

  it("returns low score for human text with few transitions", () => {
    const { sentences, tokens } = prep(HUMAN_TEXT);
    const result = transitions(HUMAN_TEXT, sentences, tokens);
    expect(result.normalized).toBeLessThan(60);
  });

  it("returns normalized in 0–100", () => {
    const { sentences, tokens } = prep(AI_TEXT);
    const result = transitions(AI_TEXT, sentences, tokens);
    expect(result.normalized).toBeGreaterThanOrEqual(0);
    expect(result.normalized).toBeLessThanOrEqual(100);
  });
});

describe("repetition signal", () => {
  it("detects repeated content words", () => {
    const repText = "technology technology technology innovation innovation innovation digital digital digital transformation transformation transformation strategy strategy strategy implementation.";
    const { sentences, tokens } = prep(repText);
    const result = repetition(repText, sentences, tokens);
    expect(result.normalized).toBeGreaterThan(30);
  });

  it("returns normalized in 0–100", () => {
    const { sentences, tokens } = prep(HUMAN_TEXT);
    const result = repetition(HUMAN_TEXT, sentences, tokens);
    expect(result.normalized).toBeGreaterThanOrEqual(0);
    expect(result.normalized).toBeLessThanOrEqual(100);
  });
});

describe("syntacticUniformity signal", () => {
  it("returns normalized in 0–100", () => {
    const { sentences, tokens } = prep(AI_TEXT);
    const result = syntacticUniformity(AI_TEXT, sentences, tokens);
    expect(result.normalized).toBeGreaterThanOrEqual(0);
    expect(result.normalized).toBeLessThanOrEqual(100);
  });

  it("handles too-few sentences gracefully", () => {
    const result = syntacticUniformity("One.", ["One."], ["one"]);
    expect(result.normalized).toBeGreaterThanOrEqual(0);
    expect(result.normalized).toBeLessThanOrEqual(100);
  });
});
