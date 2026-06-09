export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
      <div
        aria-hidden="true"
        className="w-14 h-14 rounded-full border-2 border-dashed border-[var(--border)] flex items-center justify-center text-[var(--muted)]"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 12h6M12 9v6M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-[var(--ink)]">Results will appear here</p>
      <p className="text-xs text-[var(--muted)] max-w-xs">
        Paste text into the input above and click Analyze Text. Use at least 120 words for meaningful results.
      </p>
    </div>
  );
}
