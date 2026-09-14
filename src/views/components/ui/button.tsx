import type { ComponentChildren, JSX } from "preact";

export interface ButtonProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "primary"
    | "outline"
    | "ghost"
    | "secondary"
    | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  children?: ComponentChildren;
}
export function Button({
  variant = "default",
  size = "md",
  isLoading = false,
  className = "",
  disabled = false,
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none";

  const sizeClasses = {
    sm: "h-7 px-3 text-xs",
    md: "h-10 px-4 text-[13px]",
    lg: "h-11 px-5 text-sm",
    icon: "w-7 h-7 p-0 rounded-full",
  }[size];

  const variantClasses = {
    default: "bg-ink-950 hover:bg-black text-white shadow-xs",
    primary:
      "bg-accent-500 hover:bg-accent-600 text-white shadow-sm shadow-accent-500/20",
    outline:
      "border border-black/[0.1] hover:bg-mist-50 text-ink-900 shadow-xs",
    secondary:
      "bg-mist-50 hover:bg-mist-100/80 border border-black/[0.06] text-ink-900",
    ghost: "text-ink-800/60 hover:text-ink-900 hover:bg-black/[0.04]",
    danger: "bg-red-500 hover:bg-red-600 text-white shadow-xs",
  }[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 16 16"
        >
          <circle
            cx="8"
            cy="8"
            r="6.5"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="2"
          />
          <path
            d="M14.5 8A6.5 6.5 0 0 0 8 1.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ) : null}
      {children}
    </button>
  );
}
