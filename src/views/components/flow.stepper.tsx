interface FlowStepperProps {
  hasInquiry: boolean;
}

export function FlowStepper({ hasInquiry }: FlowStepperProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        id="step-flow-inq"
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-semibold transition-all ${
          hasInquiry
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
            : "bg-accent-50 text-accent-600 border border-accent-200/60"
        }`}
      >
        {hasInquiry ? (
          <>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" fill="#10b981" />
              <path
                d="M5 8.2l2 2 4-4"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Flow 1: Inquiry Selesai</span>
          </>
        ) : (
          <>
            <span className="w-5 h-5 rounded-full bg-accent-500 text-white flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            <span>Flow 1: Inquiry (Cek Tagihan)</span>
          </>
        )}
      </div>

      <svg
        className="text-ink-800/25 shrink-0"
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M6 3l5 5-5 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div
        id="step-flow-pay"
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full font-semibold transition-all ${
          hasInquiry
            ? "bg-accent-50 text-accent-600 border border-accent-200/60"
            : "bg-black/[0.03] text-ink-800/45 border border-transparent"
        }`}
      >
        <span
          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
            hasInquiry
              ? "bg-accent-500 text-white"
              : "bg-black/10 text-ink-800/60"
          }`}
        >
          2
        </span>
        <span>
          Flow 2: {hasInquiry ? "Siap Dibayar" : "Payment (Bayar Tagihan)"}
        </span>
      </div>
    </div>
  );
}
