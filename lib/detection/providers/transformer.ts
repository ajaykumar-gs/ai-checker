import type { DetectorProvider } from "@/types";

// Placeholder for a future Hugging Face / hosted transformer classifier.
// Conforms to DetectorProvider but always throws. Replace this implementation
// when a real model endpoint is available.
export const transformerProvider: DetectorProvider = {
  name: "transformer",
  async analyze(_text: string) {
    throw new Error(
      "Transformer provider is not implemented. " +
        "To enable it, implement this module with a real model endpoint and set DETECTOR_PROVIDER=transformer."
    );
  },
};
