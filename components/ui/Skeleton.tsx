export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg bg-[var(--border)] ${className}`}
    />
  );
}

export function ResultsSkeleton() {
  return (
    <div aria-label="Loading results" role="status" className="space-y-4">
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
      <Skeleton className="h-48 w-full" />
      <span className="sr-only">Analyzing text…</span>
    </div>
  );
}
