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

export function CardHeader({
  className = "",
  children,
  ...props
}: JSX.HTMLAttributes<HTMLDivElement> & { children?: ComponentChildren }) {
  return (
    <div
      className={`px-6 py-4 border-b border-black/[0.05] flex items-center justify-between bg-mist-50/40 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className = "",
  children,
  ...props
}: JSX.HTMLAttributes<HTMLHeadingElement> & { children?: ComponentChildren }) {
  return (
    <h3
      className={`text-sm font-bold tracking-tight text-ink-900 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className = "",
  children,
  ...props
}: JSX.HTMLAttributes<HTMLParagraphElement> & {
  children?: ComponentChildren;
}) {
  return (
    <p className={`text-xs text-ink-800/45 mt-0.5 ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className = "",
  children,
  ...props
}: JSX.HTMLAttributes<HTMLDivElement> & { children?: ComponentChildren }) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className = "",
  children,
  ...props
}: JSX.HTMLAttributes<HTMLDivElement> & { children?: ComponentChildren }) {
  return (
    <div
      className={`px-6 py-4 border-t border-black/[0.05] bg-mist-50/30 flex items-center justify-end gap-2.5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
