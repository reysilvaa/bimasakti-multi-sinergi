interface LoadingSpinnerProps {
  title?: string;
  subtitle?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({
  title = "Memuat data…",
  subtitle,
  className = "",
  size = "md",
}: LoadingSpinnerProps) {
  const iconSizes = {
    sm: { box: "w-8 h-8", svg: 16, stroke: 2 },
    md: { box: "w-12 h-12", svg: 24, stroke: 2.5 },
    lg: { box: "w-16 h-16", svg: 32, stroke: 3 },
  };

  const currentSize = iconSizes[size] || iconSizes.md;

  return (
    <div
      className={`text-center flex flex-col items-center justify-center p-8 animate-card-in ${className}`}
    >
      <div
        className={`${currentSize.box} mx-auto rounded-full bg-accent-50 text-accent-600 flex items-center justify-center mb-4 shadow-sm ring-1 ring-accent-500/10`}
      >
        <svg
          className="animate-spin"
          width={currentSize.svg}
          height={currentSize.svg}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="9.5"
            stroke="currentColor"
            strokeOpacity="0.2"
            strokeWidth={currentSize.stroke}
          />
          <path
            d="M21.5 12A9.5 9.5 0 0 0 12 2.5"
            stroke="currentColor"
            strokeWidth={currentSize.stroke}
            strokeLinecap="round"
          />
        </svg>
      </div>
      {title && <p className="text-sm font-bold text-ink-900">{title}</p>}
      {subtitle && (
        <p className="text-xs text-ink-800/50 mt-1 max-w-sm">{subtitle}</p>
      )}
    </div>
  );
}
