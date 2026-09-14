import { useEffect, useMemo, useState } from "preact/hooks";
import { Button, Card } from "@/views/components/ui/index.js";

const DEFAULT_README = `# Sistem Pembayaran Tagihan PDAM (Sidoarjo & Bondowoso)

Aplikasi Full-Stack Web Gateway Pembayaran Tagihan Air PDAM (PDAM Sidoarjo & PDAM Bondowoso) terintegrasi dengan API Rajabiller Fastpay, sesuai dokumen **Full Stack Dev Test (Rev 2.1.3)** PT. Bimasakti Multi Sinergi.

Dibangun menggunakan arsitektur modern: **Node.js + Express + TypeScript (ESM)**, MySQL via **Drizzle ORM** (\`mysql2\` pool), frontend Preact + Tailwind CSS + Vite/esbuild bundle dengan multi-tier compression (Zstandard, Brotli, Gzip).

---

## Fitur Utama

- **Inquiry & Cek Tagihan Real-Time**: Terhubung langsung ke API Biller PDAM (Rajabiller Fastpay) untuk verifikasi nomor pelanggan & nominal tagihan.
- **Konfirmasi Pembayaran**: Dialog konfirmasi sebelum pembayaran diproses untuk memvalidasi identitas pelanggan dan total tagihan.
- **Eksekusi Pembayaran & Idempotensi**: Mencegah klik ganda dan pembayaran duplikat berbasis kunci idempotensi unik per sesi transaksi.
- **Cetak & Unduh Struk Resmi**: Tampilan struk kasir termal presisi dengan fitur Cetak Instan (isolated print frame) dan Unduh file teks (\`.txt\`).
- **Riwayat Transaksi Lengkap**: Pencarian multi-kriteria berdasarkan ID Pelanggan, Nama, atau Nomor Resi dengan filter wilayah PDAM.
- **Interactive Scalar-style API Docs**: Dokumentasi API interaktif dengan request tester, cuplikan kode cURL/JavaScript, dan referensi Response Code (RC).
- **Performa Ekstrem**: Kompresi statis otomatis multi-tier (Zstd level 19, Brotli level 11, Gzip level 9) dengan negosiasi header otomatis.

---

## Alur Transaksi (Sesuai Spesifikasi)

1. Pengguna memilih **Wilayah PDAM** dan memasukkan **Nomor ID Pelanggan (idpel)**.
2. Frontend memanggil API Internal \`POST /api/inquiry\` → Gateway meneruskan ke Rajabiller \`fastpay.inq\`.
3. Rincian tagihan (nama, periode, nominal air, denda, admin, total bayar) ditampilkan di antarmuka.
4. Pengguna menekan tombol **Bayar Sekarang**, sistem memunculkan dialog konfirmasi.
5. Setelah dikonfirmasi, Frontend memanggil \`POST /api/payment\` → Gateway meneruskan ke Rajabiller \`fastpay.pay\`.
6. Transaksi sukses disimpan secara permanen ke database internal MySQL menggunakan Drizzle ORM.
7. Modal struk pembayaran terbuka secara otomatis dan riwayat transaksi diperbarui seketika.

---

## Daftar Produk & ID Pelanggan Contoh

| Nama Wilayah PDAM | Kode Produk | ID Pelanggan Contoh |
|:---|:---:|:---:|
| PDAM KAB. SIDOARJO | \`WASDA\` | \`01002676\` |
| PDAM KAB. BONDOWOSO | \`WABONDO\` | \`09000879\` |

---

## Spesifikasi Endpoint API Internal

Semua response API dibungkus dalam format standar envelope:

\`\`\`json
{
  "rc": "00",
  "ket": "sukses",
  "data": { ... }
}
\`\`\`

| Method | Endpoint | Deskripsi |
|:---|:---|:---|
| \`GET\` | \`/api/products\` | Mengambil daftar wilayah PDAM beserta sample IDPEL |
| \`POST\` | \`/api/inquiry\` | Cek tagihan pelanggan (\`productCode\`, \`customerId\`) |
| \`POST\` | \`/api/payment\` | Eksekusi bayar tagihan (\`productCode\`, \`customerId\`, \`ref1\`, \`ref2\`, \`nominal\`) |
| \`GET\` | \`/api/transactions\` | Riwayat transaksi tersimpan di database internal |
| \`GET\` | \`/api/transactions/:id\` | Detail transaksi spesifik & teks format struk kasir |
| \`GET\` | \`/api/transactions/:id/receipt\` | Unduh struk kasir fisik sebagai file \`.txt\` |
| \`GET\` | \`/api/readme\` | Mengambil isi dokumentasi README ini dalam format Markdown |

---

## Proteksi & Keamanan Transaksi

1. **Idempotency Key Verification**: Mencegah request ganda dari jaringan tidak stabil atau klik berulang dari user menggunakan verifikasi parameter \`ref2\`.
2. **Exponential Backoff Database Retry**: Koneksi database MySQL otomatis melakukan retry dengan backoff eksponensial jika terjadi socket drop sementara.
3. **Strict Boundary Validation**: Setiap payload masuk divalidasi ketat di layer controller menggunakan skema Zod sebelum diproses ke layer service.
4. **Isolated Receipt Printing**: Pencetakan struk menggunakan iframe terisolasi untuk memastikan tampilan struk kasir presisi tanpa merusak halaman utama.

---

## Panduan Instalasi & Menjalankan Lokal

### 1. Clone & Instalasi Dependensi
\`\`\`bash
git clone <url-repository>
cd bimasakti-multi-sinergi
npm install
\`\`\`

### 2. Konfigurasi Lingkungan (.env)
Salin file template lingkungan:
\`\`\`bash
cp .env.example .env
\`\`\`
Isi kredensial database MySQL dan kredensial Rajabiller:
\`\`\`ini
PORT=3000
NODE_ENV=development
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=bimasakti_pdam
RAJABILLER_URL=https://c-dev-partnerlink.rajabiller.com/json/index.php
RAJABILLER_UID=SP300203
RAJABILLER_PIN=311575
\`\`\`

### 3. Migrasi Database
\`\`\`bash
npm run db:migrate
\`\`\`

### 4. Menjalankan Server
\`\`\`bash
# Mode Development (Auto-Reload)
npm run dev

# Mode Production Build
npm run build
npm start
\`\`\`
Akses aplikasi melalui browser di \`http://localhost:3000\`.
`;

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function ReadmeViewer({
  onNavigateToApp,
}: {
  onNavigateToApp?: () => void;
}) {
  const [content, setContent] = useState<string>(DEFAULT_README);
  const [copied, setCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/readme")
      .then((res) => res.json())
      .then((res) => {
        if (res.rc === "00" && res.data?.content) {
          setContent(res.data.content);
        }
      })
      .catch(() => {
        // Fallback to DEFAULT_README
      });
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Extract Table of Contents
  const toc = useMemo<TocItem[]>(() => {
    const lines = content.split("\n");
    const items: TocItem[] = [];
    lines.forEach((line) => {
      const h2Match = line.match(/^##\s+(.+)$/);
      const h3Match = line.match(/^###\s+(.+)$/);
      if (h2Match) {
        const text = h2Match[1].replace(/[*`_]/g, "").trim();
        const id = text
          .toLowerCase()
          .replace(/[^\w]+/g, "-")
          .replace(/^-|-$/g, "");
        items.push({ id, text, level: 2 });
      } else if (h3Match) {
        const text = h3Match[1].replace(/[*`_]/g, "").trim();
        const id = text
          .toLowerCase()
          .replace(/[^\w]+/g, "-")
          .replace(/^-|-$/g, "");
        items.push({ id, text, level: 3 });
      }
    });
    return items;
  }, [content]);

  // Simple Markdown to HTML Parser
  const renderedHtml = useMemo(() => {
    let md = content;

    // Filter by search query if any
    if (searchQuery.trim()) {
      const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
      // Highlights will be applied post-render or safely
    }

    // Escape raw HTML tags except allowed img
    md = md.replace(/<(?!\/?(img|br|span|div)\b)[^>]+>/gi, "");

    // Code blocks (fenced)
    const codeBlocks: string[] = [];
    md = md.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_match, lang, code) => {
      const idx = codeBlocks.length;
      const cleanCode = code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      codeBlocks.push(`
        <div class="my-5 rounded-xl overflow-hidden border border-black/[0.08] shadow-sm bg-[#1e293b] text-white">
          <div class="px-4 py-2 bg-slate-900 border-b border-slate-700/60 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>${lang || "text"}</span>
            <button type="button" class="copy-code-btn px-2 py-1 hover:text-white transition-colors cursor-pointer rounded bg-slate-800 hover:bg-slate-700 text-[11px]" onclick="navigator.clipboard.writeText(this.closest('.my-5').querySelector('code').innerText); this.innerText='Tersalin!'; setTimeout(()=>this.innerText='Salin', 2000)">Salin</button>
          </div>
          <pre class="p-4 text-xs font-mono overflow-x-auto leading-relaxed text-emerald-300"><code>${cleanCode.trim()}</code></pre>
        </div>
      `);
      return `%%CODEBLOCK_${idx}%%`;
    });

    // Images: ![alt](url)
    md = md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, url) => {
      return `
        <figure class="my-6 text-center">
          <img src="${url}" alt="${alt}" class="rounded-xl border border-black/[0.08] shadow-md max-w-full h-auto mx-auto cursor-pointer hover:opacity-95 transition-opacity" onclick="window.__openImageModal && window.__openImageModal('${url}')" />
          ${alt ? `<figcaption class="text-xs text-ink-800/50 mt-2 italic">${alt}</figcaption>` : ""}
        </figure>
      `;
    });

    // Headers with IDs for TOC
    md = md.replace(/^#\s+(.+)$/gm, (_match, text) => {
      return `<h1 class="text-2xl lg:text-3xl font-bold text-ink-950 tracking-tight pb-3 mb-6 border-b border-black/[0.08] flex items-center gap-3"><span>${text}</span></h1>`;
    });

    md = md.replace(/^##\s+(.+)$/gm, (_match, text) => {
      const cleanText = text.replace(/[*`_]/g, "").trim();
      const id = cleanText.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
      return `<h2 id="${id}" class="text-xl font-bold text-ink-900 tracking-tight pt-8 pb-2 mb-4 border-b border-black/[0.06] flex items-center gap-2 group"><a href="#${id}" class="text-accent-500 opacity-0 group-hover:opacity-100 transition-opacity">#</a><span>${text}</span></h2>`;
    });

    md = md.replace(/^###\s+(.+)$/gm, (_match, text) => {
      const cleanText = text.replace(/[*`_]/g, "").trim();
      const id = cleanText.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
      return `<h3 id="${id}" class="text-base font-bold text-ink-900 pt-5 pb-1 mb-2 flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-accent-500 inline-block"></span><span>${text}</span></h3>`;
    });

    // Horizontal rules
    md = md.replace(/^(?:---|\*\*\*|___)\s*$/gm, `<hr class="my-8 border-t border-black/[0.08]" />`);

    // Tables
    md = md.replace(/((?:\|[^\n]+\|\n)+)/g, (tableMatch) => {
      const lines = tableMatch.trim().split("\n");
      if (lines.length < 2) return tableMatch;

      const headerCells = lines[0].split("|").slice(1, -1).map((c) => c.trim());
      const bodyLines = lines.slice(2);

      let tableHtml = `<div class="my-6 overflow-x-auto rounded-xl border border-black/[0.08] shadow-sm bg-white"><table class="w-full text-xs text-left">`;
      tableHtml += `<thead class="bg-mist-50/60 border-b border-black/[0.06] text-ink-800 font-bold uppercase tracking-wider text-[11px]"><tr>`;
      headerCells.forEach((c) => {
        tableHtml += `<th class="px-4 py-3">${c}</th>`;
      });
      tableHtml += `</tr></thead><tbody class="divide-y divide-black/[0.04]">`;

      bodyLines.forEach((row) => {
        const cells = row.split("|").slice(1, -1).map((c) => c.trim());
        tableHtml += `<tr class="hover:bg-mist-50/40 transition-colors">`;
        cells.forEach((c) => {
          tableHtml += `<td class="px-4 py-2.5 text-ink-900 leading-relaxed">${c}</td>`;
        });
        tableHtml += `</tr>`;
      });

      tableHtml += `</tbody></table></div>`;
      return tableHtml;
    });

    // Blockquotes & GitHub Alerts
    md = md.replace(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n((?:>.*\n?)+)/gim, (_match, type, text) => {
      const clean = text.replace(/^>\s?/gm, "").trim();
      const badgeColor =
        type === "TIP" ? "emerald" : type === "WARNING" ? "amber" : type === "IMPORTANT" ? "purple" : "blue";
      return `
        <div class="my-4 p-4 rounded-xl border-l-4 border-${badgeColor}-500 bg-${badgeColor}-50/50 text-xs text-ink-900 leading-relaxed">
          <span class="font-bold uppercase tracking-wider text-[10px] text-${badgeColor}-700 block mb-1">${type}</span>
          <div>${clean}</div>
        </div>
      `;
    });

    md = md.replace(/^>\s+(.+)$/gm, (_match, text) => {
      return `<blockquote class="my-4 pl-4 border-l-4 border-accent-500/40 italic text-ink-800/70 text-xs leading-relaxed">${text}</blockquote>`;
    });

    // Unordered lists
    md = md.replace(/^\s*[-*]\s+(.+)$/gm, `<li class="ml-4 list-disc text-xs text-ink-800 leading-relaxed my-1">$1</li>`);

    // Ordered lists
    md = md.replace(/^\s*(\d+)\.\s+(.+)$/gm, `<li class="ml-4 list-decimal text-xs text-ink-800 leading-relaxed my-1">$2</li>`);

    // Bold & Italics
    md = md.replace(/\*\*([^*]+)\*\*/g, `<strong class="font-bold text-ink-950">$1</strong>`);
    md = md.replace(/\*([^*]+)\*/g, `<em class="italic text-ink-800/80">$1</em>`);

    // Inline Code
    md = md.replace(/`([^`]+)`/g, `<code class="px-1.5 py-0.5 rounded bg-mist-100 text-accent-700 font-mono text-[11px] border border-black/[0.05]">$1</code>`);

    // Links
    md = md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, `<a href="$2" target="_blank" rel="noreferrer" class="text-accent-600 hover:text-accent-700 font-semibold underline decoration-accent-500/30 hover:decoration-accent-600 transition-colors">$1</a>`);

    // Paragraphs
    const paragraphs = md.split(/\n\s*\n/);
    md = paragraphs
      .map((p) => {
        const trimmed = p.trim();
        if (
          trimmed.startsWith("<h") ||
          trimmed.startsWith("<div") ||
          trimmed.startsWith("<figure") ||
          trimmed.startsWith("<table") ||
          trimmed.startsWith("<blockquote") ||
          trimmed.startsWith("<hr") ||
          trimmed.startsWith("<li") ||
          trimmed.startsWith("%%CODEBLOCK_")
        ) {
          return trimmed;
        }
        return `<p class="text-xs lg:text-[13px] text-ink-800/85 leading-relaxed my-3">${trimmed.replace(/\n/g, "<br/>")}</p>`;
      })
      .join("\n\n");

    // Restore Code Blocks
    codeBlocks.forEach((block, idx) => {
      md = md.replace(`%%CODEBLOCK_${idx}%%`, block);
    });

    return md;
  }, [content, searchQuery]);

  // Hook image modal helper to window
  useEffect(() => {
    (window as unknown as { __openImageModal?: (url: string) => void }).__openImageModal = (url: string) => {
      setSelectedImage(url);
    };
    return () => {
      delete (window as unknown as { __openImageModal?: (url: string) => void }).__openImageModal;
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-black/[0.06] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <h2 className="text-base font-bold text-ink-950">
              Dokumentasi Resmi Proyek (README.md)
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 text-[10px] font-bold">
              Rev 2.1.3
            </span>
          </div>
          <p className="text-xs text-ink-800/50 mt-1">
            Format render interaktif, lengkap dengan arsitektur, daftar produk, dan panduan teknis
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {onNavigateToApp && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onNavigateToApp}
              className="gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Buka Gateway Pembayaran
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-1.5"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? "Tersalin!" : "Salin Raw"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="gap-1.5"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Unduh .md
          </Button>
        </div>
      </div>

      {/* Main Content Grid: TOC + Document */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sticky Table of Contents (Desktop) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24">
          <Card className="p-4 border-black/[0.06] bg-mist-50/40">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-black/[0.06]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-800/60">
                Daftar Isi
              </span>
              <span className="text-[10px] text-accent-600 font-mono font-semibold">
                {toc.length} Bagian
              </span>
            </div>
            <nav className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1 text-xs">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block py-1.5 px-2 rounded-lg text-ink-800/70 hover:text-ink-950 hover:bg-black/[0.04] transition-all truncate ${
                    item.level === 3 ? "pl-4 text-[11px]" : "font-semibold"
                  }`}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </Card>
        </div>

        {/* Markdown Document Reader */}
        <div className="lg:col-span-9">
          <Card className="p-6 lg:p-10 border-black/[0.06] bg-white shadow-sm overflow-hidden">
            <div
              className="readme-prose prose max-w-none text-ink-900"
              // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized & internal README viewer
              dangerouslySetInnerHTML={{ __html: renderedHtml }}
            />
          </Card>
        </div>
      </div>

      {/* Lightbox Image Preview Modal */}
      {selectedImage && (
        <div
          role="dialog"
          tabIndex={-1}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
          onKeyDown={(e) => e.key === "Escape" && setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-transparent">
            <img
              src={selectedImage}
              alt="Preview"
              className="rounded-2xl max-w-full max-h-[85vh] object-contain shadow-2xl mx-auto border border-white/20"
            />
            <p className="text-center text-xs text-white/70 mt-3 font-mono">
              Klik di mana saja untuk menutup gambar
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
