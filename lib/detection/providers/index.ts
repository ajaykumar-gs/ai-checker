import type { DetectorProvider } from "@/types";
import { heuristicProvider } from "./heuristic";
import { mockProvider } from "./mock";
import { transformerProvider } from "./transformer";

export function getProvider(): DetectorProvider {
  const name = process.env.DETECTOR_PROVIDER ?? "heuristic";
  switch (name) {
    case "mock":
      return mockProvider;
    case "transformer":
      return transformerProvider;
    case "heuristic":
    default:
      return heuristicProvider;
  }
}
