import type { ComponentChildren, JSX } from "preact";

export function Card({
  className = "",
  children,
  ...props
}: JSX.HTMLAttributes<HTMLDivElement> & { children?: ComponentChildren }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-black/[0.06] shadow-xs overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
