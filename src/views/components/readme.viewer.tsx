import { useEffect, useMemo, useState } from "preact/hooks";
import { Marked, type Tokens } from "marked";
import { Button, Card } from "@/views/components/ui/index.js";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

const toId = (text: string) =>
  text
    .replace(/<[^>]*>/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^\w]+/g, "-")
    .replace(/^-|-$/g, "");

const md = new Marked({ gfm: true });

md.use({
  renderer: {
    code(token: Tokens.Code) {
      const { text, lang } = token;
      if (lang === "mermaid") {
        return `<div class="mermaid my-6 flex justify-center bg-white border border-black/[0.07] rounded-xl p-6 overflow-x-auto">${text}</div>`;
      }
      const escaped = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      return `<div class="my-5 rounded-xl overflow-hidden border border-black/[0.08] shadow-sm bg-[#1e293b] text-white"><div class="px-4 py-2 bg-slate-900 border-b border-slate-700/60 flex items-center justify-between text-xs font-mono text-slate-400"><span>${lang ?? "text"}</span><button type="button" class="px-2 py-1 hover:text-white transition-colors cursor-pointer rounded bg-slate-800 hover:bg-slate-700 text-[11px]" onclick="navigator.clipboard.writeText(this.closest('.my-5').querySelector('code').innerText);this.innerText='Tersalin!';setTimeout(()=>this.innerText='Salin',2000)">Salin</button></div><pre class="p-4 text-xs font-mono overflow-x-auto leading-relaxed text-emerald-300"><code>${escaped.trim()}</code></pre></div>`;
    },

    heading(token: Tokens.Heading) {
      const text = this.parser.parseInline(token.tokens);
      const plainText = token.text.replace(/<[^>]*>/g, "").trim();
      const id = toId(plainText);
      const cls: Record<number, string> = {
        1: "text-2xl lg:text-3xl font-bold text-ink-950 tracking-tight pb-3 mb-6 border-b border-black/[0.08]",
        2: "text-xl font-bold text-ink-900 tracking-tight pt-8 pb-2 mb-4 border-b border-black/[0.06]",
        3: "text-base font-bold text-ink-900 pt-5 pb-1 mb-2",
        4: "text-sm font-bold text-ink-900 pt-4 pb-1",
      };
      return `<h${token.depth} id="${id}" class="${cls[token.depth] ?? "text-sm font-semibold text-ink-900 pt-3"}">${text}</h${token.depth}>`;
    },

    image(token: Tokens.Image) {
      const { href, text } = token;
      if (href.includes("shields.io") || href.includes("/badge/")) {
        return `<img src="${href}" alt="${text || ""}" class="inline-block h-5 align-middle mr-1.5 my-1" />`;
      }
      return `<figure class="my-6 text-center"><img src="${href}" alt="${text || ""}" class="rounded-xl border border-black/[0.08] shadow-md max-w-full h-auto mx-auto cursor-pointer hover:opacity-95 transition-opacity" onclick="window.__openImageModal&&window.__openImageModal('${href}')" />${text ? `<figcaption class="text-xs text-ink-800/50 mt-2 italic">${text}</figcaption>` : ""}</figure>`;
    },

    paragraph(token: Tokens.Paragraph) {
      return `<p class="text-[13px] text-ink-800/85 leading-relaxed my-3">${this.parser.parseInline(token.tokens)}</p>`;
    },

    list(token: Tokens.List) {
      let body = "";
      for (const item of token.items) {
        body += this.listitem(item);
      }
      const tag = token.ordered ? "ol" : "ul";
      const startAttr = token.ordered && token.start !== 1 ? ` start="${token.start}"` : "";
      const cls = token.ordered
        ? "my-3 space-y-1 pl-5 list-decimal marker:text-ink-400"
        : "my-3 space-y-1 pl-5 list-disc marker:text-ink-400";
      return `<${tag}${startAttr} class="${cls}">${body}</${tag}>`;
    },

    listitem(token: Tokens.ListItem) {
      return `<li class="text-[13px] text-ink-800 leading-relaxed">${this.parser.parse(token.tokens)}</li>`;
    },

    blockquote(token: Tokens.Blockquote) {
      return `<blockquote class="my-4 pl-4 border-l-4 border-accent-500/40 italic text-ink-800/70 text-sm leading-relaxed">${this.parser.parse(token.tokens)}</blockquote>`;
    },

    hr() {
      return `<hr class="my-8 border-t border-black/[0.08]" />`;
    },

    table(token: Tokens.Table) {
      let headerCells = "";
      for (const cell of token.header) {
        const alignAttr = cell.align ? ` align="${cell.align}"` : "";
        headerCells += `<th class="px-4 py-3"${alignAttr}>${this.parser.parseInline(cell.tokens)}</th>`;
      }
      let bodyRows = "";
      for (const row of token.rows) {
        let rowCells = "";
        for (const cell of row) {
          const alignAttr = cell.align ? ` align="${cell.align}"` : "";
          rowCells += `<td class="px-4 py-2.5 text-ink-900 leading-relaxed"${alignAttr}>${this.parser.parseInline(cell.tokens)}</td>`;
        }
        bodyRows += `<tr class="hover:bg-mist-50/40 transition-colors">${rowCells}</tr>`;
      }
      return `<div class="my-6 overflow-x-auto rounded-xl border border-black/[0.08] shadow-sm bg-white"><table class="w-full text-xs text-left"><thead class="bg-mist-50/60 border-b border-black/[0.06] text-ink-800 font-bold uppercase tracking-wider text-[11px]"><tr>${headerCells}</tr></thead><tbody class="divide-y divide-black/[0.04]">${bodyRows}</tbody></table></div>`;
    },

    codespan(token: Tokens.Codespan) {
      return `<code class="px-1.5 py-0.5 rounded bg-mist-100 text-accent-700 font-mono text-[11px] border border-black/[0.05]">${token.text}</code>`;
    },

    strong(token: Tokens.Strong) {
      return `<strong class="font-bold text-ink-950">${this.parser.parseInline(token.tokens)}</strong>`;
    },

    em(token: Tokens.Em) {
      return `<em class="italic text-ink-800/80">${this.parser.parseInline(token.tokens)}</em>`;
    },

    link(token: Tokens.Link) {
      const content = token.tokens ? this.parser.parseInline(token.tokens) : token.text;
      return `<a href="${token.href}" target="_blank" rel="noreferrer" class="text-accent-600 hover:text-accent-700 font-semibold underline decoration-accent-500/30 hover:decoration-accent-600 transition-colors">${content}</a>`;
    },
  },
});

// ── Component ─────────────────────────────────────────────────────────────────

export function ReadmeViewer({
  onNavigateToApp,
}: {
  onNavigateToApp?: () => void;
}) {
  const [content, setContent] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mermaidReady, setMermaidReady] = useState(false);

  // Fetch README from API
  useEffect(() => {
    fetch("/api/readme")
      .then((res) => res.json())
      .then((res) => {
        if (res.rc === "00" && res.data?.content) setContent(res.data.content);
      })
      .catch(() => {});
  }, []);

  // Load Mermaid.js once from CDN
  useEffect(() => {
    const existing = document.getElementById("mermaid-cdn");
    if (existing) {
      // Already appended — might already be loaded
      const w = window as unknown as { mermaid?: { initialize: (c: object) => void } };
      if (w.mermaid) setMermaidReady(true);
      else existing.addEventListener("load", () => setMermaidReady(true));
      return;
    }
    const s = document.createElement("script");
    s.id = "mermaid-cdn";
    s.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
    s.onload = () => {
      (window as unknown as { mermaid?: { initialize: (c: object) => void } }).mermaid?.initialize({
        startOnLoad: false,
        theme: "neutral",
        flowchart: { curve: "basis" },
      });
      setMermaidReady(true);
    };
    document.head.appendChild(s);
  }, []);

  // Copy / Download helpers
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([content], { type: "text/markdown;charset=utf-8" })),
      download: "README.md",
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  };

  // Extract TOC from raw markdown (headings ## and ###)
  const toc = useMemo<TocItem[]>(() => {
    const items: TocItem[] = [];
    for (const line of content.split("\n")) {
      const m2 = line.match(/^##\s+(.+)$/);
      const m3 = line.match(/^###\s+(.+)$/);
      const raw = m2?.[1] ?? m3?.[1];
      if (!raw) continue;
      const text = raw.replace(/[*`_]/g, "").trim();
      const id = text.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
      items.push({ id, text, level: m2 ? 2 : 3 });
    }
    return items;
  }, [content]);

  // Render markdown via marked
  const renderedHtml = useMemo(
    () => (content ? String(md.parse(content)) : ""),
    [content],
  );

  // Hook image modal to window
  useEffect(() => {
    (window as unknown as { __openImageModal?: (u: string) => void }).__openImageModal = setSelectedImage;
    return () => {
      delete (window as unknown as { __openImageModal?: (u: string) => void }).__openImageModal;
    };
  }, []);

  // Trigger mermaid.run() after HTML injected AND CDN ready
  useEffect(() => {
    if (!mermaidReady || !renderedHtml) return;
    const tid = setTimeout(() => {
      const w = window as unknown as { mermaid?: { run: (o: object) => Promise<void> } };
      if (!w.mermaid) return;
      const nodes = Array.from(document.querySelectorAll(".readme-prose .mermaid"));
      if (!nodes.length) return;
      nodes.forEach((n) => n.removeAttribute("data-processed"));
      w.mermaid.run({ nodes }).catch(() => {});
    }, 80);
    return () => clearTimeout(tid);
  }, [renderedHtml, mermaidReady]);

  return (
    <div className="space-y-6">
      {/* Top Banner Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-black/[0.06] shadow-sm">
        <div>
          <div className="flex items-center gap-2">
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
            <Button type="button" variant="primary" size="sm" onClick={onNavigateToApp} className="gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Buka Gateway Pembayaran
            </Button>
          )}

          <Button type="button" variant="outline" size="sm" onClick={handleCopy} className="gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copied ? "Tersalin!" : "Salin Raw"}
          </Button>

          <Button type="button" variant="outline" size="sm" onClick={handleDownload} className="gap-1.5">
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
        {/* Sticky TOC (Desktop) */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24">
          <Card className="p-4 border-black/[0.06] bg-mist-50/40">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-black/[0.06]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-800/60">Daftar Isi</span>
              <span className="text-[10px] text-accent-600 font-mono font-semibold">{toc.length} Bagian</span>
            </div>
            <nav className="space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto pr-1 text-xs">
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`block py-1.5 px-2 rounded-lg text-ink-800/70 hover:text-ink-950 hover:bg-black/[0.04] transition-all truncate ${item.level === 3 ? "pl-4 text-[11px]" : "font-semibold"}`}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </Card>
        </div>

        {/* Markdown Document */}
        <div className="lg:col-span-9">
          <Card className="p-6 lg:p-10 border-black/[0.06] bg-white shadow-sm overflow-hidden">
            {content ? (
              <div
                className="readme-prose prose max-w-none text-ink-900"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: sanitized & internal README viewer
                dangerouslySetInnerHTML={{ __html: renderedHtml }}
              />
            ) : (
              <p className="text-sm text-ink-800/40 animate-pulse">Memuat dokumentasi…</p>
            )}
          </Card>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          role="dialog"
          tabIndex={-1}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
          onKeyDown={(e) => e.key === "Escape" && setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Preview"
            className="rounded-2xl max-w-full max-h-[85vh] object-contain shadow-2xl mx-auto border border-white/20"
          />
        </div>
      )}
    </div>
  );
}
