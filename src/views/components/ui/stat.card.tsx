import { Card } from "@/views/components/ui/card.js";

export interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  id?: string;
  variant?: "default" | "success" | "accent";
}

export function StatCard({
  label,
  value,
  unit,
  id,
  variant = "default",
}: StatCardProps) {
  const valueClasses = {
    default: "text-ink-900",
    success: "text-emerald-600",
    accent: "text-accent-600 tabular-nums",
  }[variant];

  return (
    <Card className="p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-800/40">
        {label}
      </p>
      <div className="flex items-baseline gap-2 mt-1.5">
        <span
          id={id}
          className={`text-2xl font-bold tracking-tight ${valueClasses}`}
        >
          {value}
        </span>
        {unit && (
          <span className="text-xs text-ink-800/40 font-medium">{unit}</span>
        )}
      </div>
    </Card>
  );
}
