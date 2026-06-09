# AI Checker

A production-ready, heuristic-based screening tool for AI-generated text likelihood. Built with Next.js 15, TypeScript (strict), Tailwind CSS, and Vitest.

**This is a screening aid, not a verdict engine.** Results are probabilistic. Do not use them as the sole basis for any accusation, academic penalty, or employment decision.

---

## Honest Limitations

- Heuristic signals are statistical proxies calibrated against surface patterns. False positives and false negatives are expected and unavoidable.
- The "perplexity" signal is a local approximation, **not** true language-model perplexity.
- Texts under 120 words are marked inconclusive.
- Paraphrased, lightly edited, or mixed-authorship text is especially hard to classify.
- Non-English text will produce degraded results.
- Code blocks and markup inflate AI-likelihood scores artificially.
- Well-written human text can score as AI-like; poorly written AI text can score as human-like.
- No accuracy percentage is claimed. No external benchmark has been validated against this tool.

---

## Local Setup

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Install

```bash
git clone <repo-url>
cd ai-checker
npm install
```

### Font

Inter is loaded automatically via `next/font/google` — no manual font files needed.

### Environment variables

Copy `.env.example` to `.env.local` and edit as needed:

```bash
cp .env.example .env.local
```

| Variable            | Default      | Options                                  |
|---------------------|--------------|------------------------------------------|
| `DETECTOR_PROVIDER` | `heuristic`  | `heuristic`, `mock`, `transformer`       |

### Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Run tests

```bash
npm test
```

### Type check

```bash
npm run typecheck
```

---

## Vercel Deployment

1. Push to a GitHub/GitLab repository.
2. Import the project in [Vercel](https://vercel.com).
3. Set `DETECTOR_PROVIDER=heuristic` in Environment Variables (or leave unset — `heuristic` is the default).
4. Deploy. No build-time changes needed.

The API route at `app/api/analyze/route.ts` uses `runtime = "nodejs"` and is Vercel-compatible.

---

## Architecture

### Detection pipeline

```
POST /api/analyze
  → getProvider()           # selects heuristic / mock / transformer
  → provider.analyze(text)
      → runEngine(text)     # lib/detection/engine.ts
          → segmentSentences + tokenize
          → 9 signal functions → SignalResult[]
          → computeWeightedScore → aiLikelihood
          → computeConfidence → "low" | "medium" | "high"
          → computeVerdict → "likely-human" | "likely-ai" | "mixed" | "inconclusive"
          → buildBreakdown → ScoreBreakdown[]
          → scoreSentences → SentenceAnalysis[]
  → AnalysisResult JSON
```

### Signals (`lib/detection/signals/`)

| File                    | What it measures                                  |
|-------------------------|---------------------------------------------------|
| `burstiness.ts`         | Std dev of sentence lengths                       |
| `perplexity.ts`         | Common-word ratio + repetition proxy (approximation only) |
| `lexicalDiversity.ts`   | TTR + MTLD-lite                                   |
| `ngramRepetition.ts`    | Repeated bi/tri-grams                             |
| `sentenceVariance.ts`   | Variance of sentence lengths (complements burstiness) |
| `entropy.ts`            | Shannon entropy deviation from natural range      |
| `transitions.ts`        | Density of AI-favored discourse markers           |
| `repetition.ts`         | Over-repeated content words                       |
| `syntacticUniformity.ts`| Sentence-opener variety + punctuation rhythm      |

### Adding a future model provider

1. Create `lib/detection/providers/my-provider.ts` implementing `DetectorProvider`:
   ```ts
   import type { DetectorProvider } from "@/types";
   export const myProvider: DetectorProvider = {
     name: "my-provider",
     async analyze(text) { /* call your model API */ },
   };
   ```
2. Register it in `lib/detection/providers/index.ts`:
   ```ts
   case "my-provider":
     return myProvider;
   ```
3. Set `DETECTOR_PROVIDER=my-provider` in your environment.

The `transformer.ts` stub is a ready placeholder — implement its `analyze` method to activate it.

---

## Scoring configuration

All weights and thresholds are in `lib/config/scoring.ts`. Change them without touching signal logic:

- `SIGNAL_WEIGHTS` — must sum to 1.0
- `VERDICT_THRESHOLDS` — `likelyHuman` (35) and `likelyAI` (65)
- `CONFIDENCE` — word count and variance thresholds
- `MIN_RELIABLE_WORDS` — below this, results are `inconclusive`
- `SENTENCE_FLAG_THRESHOLD` — sentences above this score are highlighted

---

## Project structure

```
ai-checker/
├── app/
│   ├── api/analyze/route.ts        POST endpoint
│   ├── layout.tsx
│   ├── page.tsx                    App shell
│   └── globals.css                 Design tokens + @font-face
├── components/
│   ├── analyzer/                   TextInput, AnalyzeButton, ExampleTexts, EmptyState
│   ├── results/                    ResultsDashboard, ScoreCard, SignalBreakdown,
│   │                               SentenceAnalysis, Methodology, Limitations, ExportJson
│   ├── ui/                         Card, Tabs, Badge, Skeleton
│   └── ThemeToggle.tsx
├── lib/
│   ├── detection/
│   │   ├── providers/              heuristic, mock, transformer (stub), index
│   │   ├── signals/                one file per signal
│   │   ├── engine.ts               orchestrates signals → AnalysisResult
│   │   └── aggregate.ts            weighting, normalization, confidence, verdict
│   ├── text/                       segment.ts, preprocess.ts
│   └── config/scoring.ts           all tunable constants
├── types/index.ts
├── data/samples.ts                 5 labeled demo texts
└── __tests__/                      Vitest unit tests
```
