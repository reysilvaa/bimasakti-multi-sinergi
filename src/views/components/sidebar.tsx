import type { Product } from "@/views/utils.js";

interface SidebarProps {
  currentTab: "inquiry" | "history" | "docs" | "readme";
  onSelectTab: (tab: "inquiry" | "history" | "docs" | "readme") => void;
  products: Product[];
  onSelectProduct: (code: string, idpel: string) => void;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  products,
  onSelectProduct,
}: SidebarProps) {
  return (
    <>
    <aside className="print:hidden w-60 shrink-0 hidden md:flex flex-col fixed inset-y-0 left-0 bg-white border-r border-black/[0.06] z-40">
      {/* Brand */}
      <div className="h-16 flex items-center px-4 border-b border-black/[0.05]">
        <a
          href="/"
          className="flex items-center gap-2.5 min-w-0"
          title="PT. Bimasakti Multi Sinergi"
        >
          <img
            src="/images/logo.png"
            alt="Bimasakti"
            className="h-8 w-auto object-contain shrink-0"
          />
          <div className="min-w-0 leading-tight">
            <span className="text-[12px] font-bold tracking-tight text-ink-950 block truncate">
              PT. Bimasakti
            </span>
            <span className="text-[10px] font-medium text-ink-800/50 block truncate">
              Multi Sinergi
            </span>
          </div>
        </a>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-800/35">
          Menu
        </p>
        <button
          type="button"
          id="nav-inquiry-btn"
          onClick={() => onSelectTab("inquiry")}
          className={`w-full flex items-center gap-2.5 px-3 h-10 rounded-xl text-[13px] font-semibold transition-all ${
            currentTab === "inquiry"
              ? "bg-ink-950 text-white"
              : "text-ink-800/60 hover:text-ink-900 hover:bg-black/[0.04]"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v15.5L12 17l-6.5 3.5V5A1.5 1.5 0 0 1 7 3.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          <span>Bayar Tagihan</span>
        </button>
        <button
          type="button"
          id="nav-history-btn"
          onClick={() => onSelectTab("history")}
          className={`w-full flex items-center gap-2.5 px-3 h-10 rounded-xl text-[13px] font-semibold transition-all ${
            currentTab === "history"
              ? "bg-ink-950 text-white"
              : "text-ink-800/60 hover:text-ink-900 hover:bg-black/[0.04]"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="8.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M12 7.5V12l3 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Riwayat Transaksi</span>
        </button>

        <button
          type="button"
          id="nav-docs-btn"
          onClick={() => onSelectTab("docs")}
          className={`w-full flex items-center gap-2.5 px-3 h-10 rounded-xl text-[13px] font-semibold transition-all ${
            currentTab === "docs"
              ? "bg-ink-950 text-white"
              : "text-ink-800/60 hover:text-ink-900 hover:bg-black/[0.04]"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="M6 6h10M6 10h10M6 14h6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span>Dokumentasi API</span>
        </button>
        <button
          type="button"
          id="nav-readme-btn"
          onClick={() => onSelectTab("readme")}
          className={`w-full flex items-center gap-2.5 px-3 h-10 rounded-xl text-[13px] font-semibold transition-all ${
            currentTab === "readme"
              ? "bg-ink-950 text-white shadow-sm"
              : "text-ink-800/60 hover:text-ink-900 hover:bg-black/[0.04]"
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span>Panduan & README</span>
        </button>
      </nav>

      <div className="px-3 pb-4">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-800/35">
          Produk Aktif
        </p>
        <div id="sidebar-products" className="space-y-1">
          {products.map((p) => (
            <button
              key={p.code}
              type="button"
              onClick={() => {
                onSelectTab("inquiry");
                onSelectProduct(p.code, p.defaultIdpel);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-black/[0.04] transition-colors text-left"
            >
              <span className="w-7 h-7 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                {p.code.slice(0, 2)}
              </span>
              <span className="min-w-0">
                <span className="block text-[12px] font-semibold text-ink-900 truncate">
                  {p.name}
                </span>
                <span className="block text-[10px] font-mono text-ink-800/45">
                  {p.defaultIdpel}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>

    {/* Mobile bottom navigation */}
    <nav className="print:hidden md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-black/[0.06] flex">
      {([
        { tab: "inquiry" as const, label: "Bayar", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v15.5L12 17l-6.5 3.5V5A1.5 1.5 0 0 1 7 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg> },
        { tab: "history" as const, label: "Riwayat", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5"/><path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
        { tab: "docs" as const, label: "API", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><path d="M6 6h10M6 10h10M6 14h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg> },
        { tab: "readme" as const, label: "README", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
      ]).map(({ tab, label, icon }) => (
        <button
          key={tab}
          type="button"
          onClick={() => onSelectTab(tab)}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 text-[10px] font-semibold transition-colors ${
            currentTab === tab ? "text-ink-950" : "text-ink-800/40"
          }`}
        >
          {icon}
          {label}
        </button>
      ))}
    </nav>
    </>
  );
}
