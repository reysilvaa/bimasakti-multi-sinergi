import type { JSX } from "preact";

export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
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
      <input
        id={id}
        className={`w-full h-11 px-3.5 rounded-xl bg-mist-50/60 border border-black/[0.08] focus:border-accent-500 focus:bg-white text-sm font-medium transition-all outline-none disabled:opacity-50 ${
          error ? "border-red-500" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
