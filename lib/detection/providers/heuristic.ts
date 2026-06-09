import type { DetectorProvider, AnalysisResult } from "@/types";
import { runEngine } from "@/lib/detection/engine";

export const heuristicProvider: DetectorProvider = {
  name: "heuristic",
  async analyze(text: string): Promise<AnalysisResult> {
    return runEngine(text);
  },
};
