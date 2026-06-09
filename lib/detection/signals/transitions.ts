import type { SignalResult } from "@/types";

// Density of transition / discourse-marker phrases.
// AI models overuse these to create surface-level coherence.
// High density → AI-like → HIGH score.
//
// raw = (transition phrase hits) / sentence count
// normalized = clamp(raw / 0.5 * 100, 0, 100)  — 0.5 hits/sentence = 100

const TRANSITION_PHRASES = [
  "furthermore", "moreover", "additionally", "in addition", "as a result",
  "consequently", "therefore", "thus", "hence", "in conclusion", "to summarize",
  "in summary", "overall", "ultimately", "it is worth noting", "it is important to note",
  "it should be noted", "notably", "importantly", "significantly",
  "on the other hand", "however", "nevertheless", "nonetheless", "conversely",
  "in contrast", "by contrast", "first and foremost", "last but not least",
  "in other words", "that is to say", "to put it simply", "in essence",
  "at the end of the day", "in light of", "with that in mind", "to this end",
  "moving forward", "going forward", "in today's world", "in the modern era",
  "in recent years", "as mentioned", "as previously", "as noted above",
  "to begin with", "first of all", "in the first place", "for instance",
  "for example", "such as", "including", "namely", "specifically",
  "to illustrate", "in particular",
];

export function transitions(
  text: string,
  sentences: string[],
  _tokens: string[]
): SignalResult {
  const lower = text.toLowerCase();
  const hits = TRANSITION_PHRASES.filter((phrase) => lower.includes(phrase));
  const hitCount = hits.length;

  const sentenceCount = Math.max(1, sentences.length);
  const raw = hitCount / sentenceCount;
  const normalized = Math.round(Math.min(100, (raw / 0.5) * 100));

  return {
    raw: Math.round(raw * 1000) / 1000,
    normalized,
    detail: `Found ${hitCount} transition phrase(s) across ${sentenceCount} sentences (${raw.toFixed(2)} per sentence). AI models overuse these markers: ${hits.slice(0, 5).join(", ")}${hits.length > 5 ? "…" : ""}.`,
  };
}
