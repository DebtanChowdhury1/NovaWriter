import type { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: ReactNode;
  helperText?: string;
  icon: LucideIcon;
  accent?: "primary" | "secondary" | "accent";
}

export function StatCard({
  title,
  value,
  helperText,
  icon: Icon,
  accent = "primary",
}: StatCardProps) {
  const accentClass =
    accent === "secondary"
      ? "text-secondary bg-secondary/10"
      : accent === "accent"
        ? "text-accent bg-accent/10"
        : "text-primary bg-primary/10";

  return (
    <article className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body gap-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-base-content/70">{title}</p>
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-full ${accentClass}`}
          >
            <Icon className="h-4 w-4" />
          </span>
        </div>
        <p className="text-2xl font-semibold tracking-tight">{value}</p>
        {helperText ? (
          <p className="text-xs text-base-content/60">{helperText}</p>
        ) : null}
      </div>
    </article>
  );
}
