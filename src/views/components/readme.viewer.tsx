import { useEffect, useMemo, useState } from "preact/hooks";
import { Button, Card } from "@/views/components/ui/index.js";

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
  const [content, setContent] = useState<string>("");
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
        // Fallback: empty
      });
  }, []);

  // Load Mermaid.js once from CDN
  useEffect(() => {
    if (document.getElementById("mermaid-cdn")) return;
    const s = document.createElement("script");
    s.id = "mermaid-cdn";
    s.src = "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";
    s.onload = () => {
      (window as unknown as { mermaid?: { initialize: (cfg: object) => void } }).mermaid?.initialize({
        startOnLoad: false,
        theme: "neutral",
        flowchart: { curve: "basis" },
      });
    };
    document.head.appendChild(s);
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
    md = md.replace(/<(?!\/?(img|br|span|div|svg|path|circle|rect|text|g|marker|defs|polygon|polyline|line|ellipse)\b)[^>]+>/gi, "");

    // Code blocks (fenced) — Mermaid gets its own div, others get dark code panel
    const codeBlocks: string[] = [];
    md = md.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_match, lang, code) => {
      const idx = codeBlocks.length;
      if (lang === "mermaid") {
        codeBlocks.push(`<div class="mermaid my-6 flex justify-center bg-white border border-black/[0.07] rounded-xl p-6 overflow-x-auto">${code.trim()}</div>`);
        return `%%CODEBLOCK_${idx}%%`;
      }
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
      return `<h1 class="text-2xl lg:text-3xl font-bold text-ink-950 tracking-tight pb-3 mb-6 border-b border-black/[0.08]">${text}</h1>`;
    });

    md = md.replace(/^##\s+(.+)$/gm, (_match, text) => {
      const cleanText = text.replace(/[*`_]/g, "").trim();
      const id = cleanText.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
      return `<h2 id="${id}" class="text-xl font-bold text-ink-900 tracking-tight pt-8 pb-2 mb-4 border-b border-black/[0.06]">${text}</h2>`;
    });

    md = md.replace(/^###\s+(.+)$/gm, (_match, text) => {
      const cleanText = text.replace(/[*`_]/g, "").trim();
      const id = cleanText.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
      return `<h3 id="${id}" class="text-base font-bold text-ink-900 pt-5 pb-1 mb-2">${text}</h3>`;
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

    // Unordered lists — wrap consecutive <li> groups in <ul>
    md = md.replace(/^\s*[-*]\s+(.+)$/gm, `<li class="ml-5 list-disc marker:text-ink-400 text-[13px] text-ink-800 leading-relaxed my-1">$1</li>`);
    md = md.replace(/((?:<li class="ml-5 list-disc[^"]*">[\s\S]*?<\/li>\n?)+)/g, `<ul class="my-3 space-y-1 pl-1">$1</ul>`);

    // Ordered lists — wrap in <ol>
    md = md.replace(/^\s*(\d+)\.\s+(.+)$/gm, `<li class="ml-5 list-decimal marker:text-ink-400 text-[13px] text-ink-800 leading-relaxed my-1">$2</li>`);
    md = md.replace(/((?:<li class="ml-5 list-decimal[^"]*">[\s\S]*?<\/li>\n?)+)/g, `<ol class="my-3 space-y-1 pl-1">$1</ol>`);

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

  // Run Mermaid after HTML is injected into DOM
  useEffect(() => {
    const w = window as unknown as { mermaid?: { run: (opts: object) => void } };
    if (!w.mermaid) return;
    const nodes = document.querySelectorAll(".readme-prose .mermaid");
    if (nodes.length === 0) return;
    // Reset already-processed diagrams so mermaid re-renders them
    nodes.forEach((n) => n.removeAttribute("data-processed"));
    w.mermaid.run({ nodes: Array.from(nodes) });
  }, [renderedHtml]);

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
