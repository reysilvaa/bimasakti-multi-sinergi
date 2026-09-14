import type { ComponentChildren, JSX } from "preact";

export interface BadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "accent" | "outline";
  children?: ComponentChildren;
}

export function Badge({
  variant = "default",
  className = "",
  children,
  ...props
}: BadgeProps) {
  const baseClasses =
    "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors";

  const variantClasses = {
    default: "bg-ink-950 text-white",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
    warning: "bg-amber-50 text-amber-700 border border-amber-200/60",
    danger: "bg-red-50 text-red-700 border border-red-200/60",
    accent: "bg-accent-50 text-accent-600 border border-accent-200/60",
    outline: "bg-black/[0.04] text-ink-800/70 border border-black/[0.08]",
  }[variant];

  return (
    <span
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
