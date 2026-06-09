"use client";

interface TextInputProps {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export function TextInput({ value, onChange, disabled }: TextInputProps) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = value.length;
  const tooShort = wordCount > 0 && wordCount < 120;

  return (
    <div className="space-y-2">
      <label
        htmlFor="text-input"
        className="block text-sm font-semibold text-[var(--ink)]"
      >
        Paste text to screen
      </label>
      <textarea
        id="text-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={10}
        maxLength={50000}
        placeholder="Paste at least 120 words for meaningful results…"
        aria-describedby="text-counter text-hint"
        className="w-full resize-y rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[15px] leading-relaxed text-[var(--ink)] placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary-200)] disabled:opacity-50 transition-colors"
      />
      <div className="flex items-center justify-between">
        <p id="text-hint" className={`text-xs ${tooShort ? "text-[var(--score-mixed)]" : "text-[var(--muted)]"}`}>
          {tooShort
            ? `${wordCount} words — results will be inconclusive below 120 words`
            : "Minimum 120 words recommended for reliable screening"}
        </p>
        <p id="text-counter" aria-live="polite" className="text-xs text-[var(--muted)] tabular-nums">
          {wordCount.toLocaleString()} words · {charCount.toLocaleString()} chars
        </p>
      </div>
    </div>
  );
}
