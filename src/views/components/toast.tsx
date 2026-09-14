export interface AlertState {
  type: "success" | "error" | "info";
  title: string;
  message: string;
}

interface ToastProps {
  alert: AlertState | null;
  onClose: () => void;
}

export function Toast({ alert, onClose }: ToastProps) {
  if (!alert) return null;

  const bgClass =
    alert.type === "success"
      ? "bg-emerald-500 text-white"
      : alert.type === "error"
        ? "bg-red-500 text-white"
        : "bg-ink-900 text-white";

  return (
    <div
      id="alert-banner"
      className={`mx-6 mt-4 p-4 rounded-xl flex items-center justify-between shadow-lg shadow-black/5 animate-toast-in ${bgClass}`}
    >
      <div className="flex items-center gap-3">
        <div id="alert-icon">
          {alert.type === "success" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="m8.5 12.5 2.5 2.5 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : alert.type === "error" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="m15 9-6 6M9 9l6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 16v-4M12 8h.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </div>
        <div>
          <h4 id="alert-title" className="text-[13px] font-bold leading-tight">
            {alert.title}
          </h4>
          <p id="alert-desc" className="text-[12px] opacity-90">
            {alert.message}
          </p>
        </div>
      </div>
      <button
        type="button"
        id="alert-close-btn"
        onClick={onClose}
        className="opacity-70 hover:opacity-100 transition-opacity p-1"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M1 1L13 13M13 1L1 13"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
