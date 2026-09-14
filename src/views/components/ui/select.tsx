import type { ComponentChildren, JSX } from "preact";

export interface SelectProps
  extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children?: ComponentChildren;
}

export function Select({
  label,
  className = "",
  id,
  children,
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-800/40 mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          className={`w-full h-11 px-3.5 pr-8 rounded-xl bg-mist-50/60 border border-black/[0.08] focus:border-accent-500 focus:bg-white text-sm font-medium transition-all outline-none appearance-none cursor-pointer ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-ink-800/40">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 4.5L6 8L9.5 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
