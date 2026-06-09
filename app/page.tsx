"use client";

import { useState } from "react";
import type { AnalysisResult } from "@/types";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TextInput } from "@/components/analyzer/TextInput";
import { AnalyzeButton } from "@/components/analyzer/AnalyzeButton";
import { ExampleTexts } from "@/components/analyzer/ExampleTexts";
import { EmptyState } from "@/components/analyzer/EmptyState";
import { ResultsDashboard } from "@/components/results/ResultsDashboard";
import { ResultsSkeleton } from "@/components/ui/Skeleton";

type AppState = "idle" | "loading" | "done" | "error";

export default function Home() {
  const [text, setText] = useState("");
  const [state, setState] = useState<AppState>("idle");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function analyze() {
    if (!text.trim()) return;
    setState("loading");
    setResult(null);
    setErrorMsg("");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? `Server error ${res.status}`);
      }
      const data = (await res.json()) as AnalysisResult;
      setResult(data);
      setState("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unexpected error. Please try again.");
      setState("error");
    }
  }

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--paper)] bg-opacity-90 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              aria-hidden="true"
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--primary)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-[var(--ink)] tracking-tight">
              AI Checker
            </h1>
            <span className="hidden sm:inline text-xs text-[var(--muted)] ml-1">
              — probabilistic text screening
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Input panel */}
        <section aria-label="Text input" className="space-y-4">
          <TextInput value={text} onChange={setText} disabled={state === "loading"} />
          <ExampleTexts onSelect={setText} disabled={state === "loading"} />
          <div className="flex items-center gap-4">
            <AnalyzeButton
              onClick={analyze}
              loading={state === "loading"}
              disabled={text.trim().length === 0}
            />
            {(state === "done" || state === "error") && (
              <button
                onClick={() => {
                  setText("");
                  setResult(null);
                  setState("idle");
                  setErrorMsg("");
                }}
                className="text-sm text-[var(--muted)] underline underline-offset-2 hover:text-[var(--ink)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
              >
                Clear
              </button>
            )}
          </div>
        </section>

        {/* Results panel */}
        <section aria-label="Analysis results" aria-live="polite">
          {state === "idle" && <EmptyState />}
          {state === "loading" && <ResultsSkeleton />}
          {state === "error" && (
            <div
              role="alert"
              className="rounded-xl border border-[var(--score-ai)] bg-[var(--score-ai-soft)] px-5 py-4 text-sm text-[var(--ink)]"
            >
              <p className="font-semibold mb-1">Analysis failed</p>
              <p>{errorMsg}</p>
            </div>
          )}
          {state === "done" && result && <ResultsDashboard result={result} />}
        </section>
      </main>

      <footer className="mt-16 border-t border-[var(--border)] py-6">
        <p className="text-center text-xs text-[var(--muted)]">
          AI Checker · Heuristic screening only · No text is stored · Results are probabilistic, not definitive
        </p>
      </footer>
    </div>
  );
}
