interface AnalyzeButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled: boolean;
}

export function AnalyzeButton({ onClick, loading, disabled }: AnalyzeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
      className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[var(--primary)] text-white font-semibold text-sm tracking-wide hover:bg-[var(--primary-deep)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          Analyzing…
        </span>
      ) : (
        "Analyze Text"
      )}
    </button>
  );
}
