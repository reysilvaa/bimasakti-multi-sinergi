import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import decomment from "decomment";
import esbuild from "esbuild";

const startTime = performance.now();

// 1. Clean dist
if (fs.existsSync("dist")) {
  fs.rmSync("dist", { recursive: true, force: true });
}

// 2. Strip comments across src/ (.ts, .tsx, .js)
console.log("🧹 Stripping comments across project...");
function walkFiles(dir) {
  let list = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      list = list.concat(walkFiles(full));
    } else if (/\.(ts|tsx|js|mjs)$/.test(item.name)) {
      list.push(full);
    }
  }
  return list;
}

const SAFETY_TOKEN = "/*__SAFETY_ASSERTION__*/";
let strippedCount = 0;
for (const file of walkFiles(path.resolve("src"))) {
  const content = fs.readFileSync(file, "utf8");
  try {
    const protectedContent = content.replace(
      /\/\/\s*SAFETY:([^\n]+)/g,
      `${SAFETY_TOKEN}$1`,
    );
    const stripped = decomment(protectedContent, { trim: true });
    const restored = stripped.replace(
      new RegExp(
        `${SAFETY_TOKEN.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^\\n]+)`,
        "g",
      ),
      "// SAFETY:$1",
    );
    const cleaned = `${restored.replace(/\n{3,}/g, "\n\n").trim()}\n`;
    if (cleaned !== content) {
      fs.writeFileSync(file, cleaned, "utf8");
      strippedCount++;
    }
  } catch {}
}
if (strippedCount > 0) {
  console.log(`  ✓ Stripped comments from ${strippedCount} source file(s)`);
}

// 3. Build Client Bundle (Preact TSX -> views/js/app.js)
await esbuild.build({
  entryPoints: ["src/views/main.tsx"],
  bundle: true,
  outfile: "views/js/app.js",
  format: "iife",
  target: "es2020",
  jsx: "automatic",
  jsxImportSource: "preact",
  loader: { ".md": "text" },
  minify: true,
  treeShaking: true,
  legalComments: "none",
});

// 3. Minify CSS
const cssPath = path.resolve("views/css/style.css");
if (fs.existsSync(cssPath)) {
  const rawCss = fs.readFileSync(cssPath, "utf8");
  const minifiedCss = await esbuild.transform(rawCss, {
    loader: "css",
    minify: true,
    legalComments: "none",
  });
  fs.writeFileSync(cssPath, minifiedCss.code);
}

// 4. Build Server Bundle
await esbuild.build({
  entryPoints: {
    server: "src/server.ts",
    "scripts/migrate": "src/scripts/migrate.ts",
  },
  bundle: true,
  outdir: "dist",
  platform: "node",
  target: "node20",
  format: "esm",
  packages: "external",
  minify: true,
  treeShaking: true,
  legalComments: "none",
});

// 5. Zstd, Brotli & Gzip Pre-compression for Static Assets
const assetsToCompress = [
  "views/js/app.js",
  "views/css/style.css",
  "views/index.html",
];

console.log("⚡ Compressing static assets with Zstd, Brotli & Gzip...");
for (const relPath of assetsToCompress) {
  const fullPath = path.resolve(relPath);
  if (fs.existsSync(fullPath)) {
    const buffer = fs.readFileSync(fullPath);

    // Zstandard (level 19 = high compression, ultra-fast decompression)
    let zstKb = "N/A";
    if (typeof zlib.zstdCompressSync === "function") {
      const zst = zlib.zstdCompressSync(buffer, { level: 19 });
      fs.writeFileSync(`${fullPath}.zst`, zst);
      zstKb = (zst.length / 1024).toFixed(1);
    }

    // Brotli (quality 11 = maximum compression)
    const br = zlib.brotliCompressSync(buffer, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
      },
    });
    fs.writeFileSync(`${fullPath}.br`, br);

    // Gzip (level 9 = maximum compression fallback)
    const gz = zlib.gzipSync(buffer, { level: 9 });
    fs.writeFileSync(`${fullPath}.gz`, gz);

    const origKb = (buffer.length / 1024).toFixed(1);
    const brKb = (br.length / 1024).toFixed(1);
    const gzKb = (gz.length / 1024).toFixed(1);
    console.log(`  ${relPath}: ${origKb}KB -> zstd: ${zstKb}KB | br: ${brKb}KB | gz: ${gzKb}KB`);
  }
}

// 6. Sync to public directory for Vercel
fs.cpSync("views", "public", { recursive: true });

const elapsed = (performance.now() - startTime).toFixed(1);
console.log(`✓ Optimized build & multi-compression (zstd/br/gz) completed in ${elapsed}ms`);
