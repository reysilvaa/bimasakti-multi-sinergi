interface HeaderProps {
  currentTab: "inquiry" | "history" | "docs" | "readme";
}

export function Header({ currentTab }: HeaderProps) {
  let title = "Bayar Tagihan";
  let subtitle = "Inquiry & pembayaran tagihan PDAM";

  if (currentTab === "history") {
    title = "Riwayat Transaksi";
    subtitle = "Daftar pembayaran & unduh struk transaksi";
  } else if (currentTab === "docs") {
    title = "Dokumentasi API";
    subtitle = "Spesifikasi interaktif & live tester endpoint gateway";
  } else if (currentTab === "readme") {
    title = "Panduan & Dokumentasi Proyek";
    subtitle = "README.md dengan diagram & spesifikasi lengkap";
  }
  return (
    <header className="print:hidden h-16 sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-black/[0.06] flex items-center justify-between px-6">
      <div className="flex items-center gap-3 min-w-0">
        <a
          href="/"
          className="md:hidden flex items-center gap-2 shrink-0"
          title="PT. Bimasakti Multi Sinergi"
        >
          <img
            src="/images/logo.png"
            alt="Bimasakti"
            className="h-7 w-auto object-contain shrink-0"
          />
          <span className="text-[12px] font-bold text-ink-950">
            PT. Bimasakti
          </span>
        </a>
        <div className="min-w-0">
          <h1
            id="page-title"
            className="text-[15px] font-bold tracking-tight truncate"
          >
            {title}
          </h1>
          <p
            id="page-subtitle"
            className="text-[11px] text-ink-800/45 truncate"
          >
            {subtitle}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-mist-200 flex items-center justify-center text-[11px] font-bold text-ink-800/70">
          OP
        </div>
      </div>
    </header>
  );
}
