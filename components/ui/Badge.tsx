import type { ReactNode } from "react";

type Variant = "ai" | "human" | "mixed" | "inconclusive" | "default";

const VARIANT_CLASSES: Record<Variant, string> = {
  ai: "bg-[var(--score-ai)] text-white",
  human: "bg-[var(--score-human)] text-white",
  mixed: "bg-[var(--score-mixed)] text-[var(--ink)]",
  // Accent (#99CCFF) is too light for white text — use dark ink
  inconclusive: "bg-[var(--accent)] text-[var(--ink)]",
  default: "bg-[var(--primary-50)] text-[var(--primary)]",
};

interface BadgeProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
