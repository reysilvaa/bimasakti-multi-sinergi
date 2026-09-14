import fs from "node:fs";

const paths = ["dist", "public", "views/js/app.js"];
for (const p of paths) {
  if (fs.existsSync(p)) {
    fs.rmSync(p, { recursive: true, force: true });
  }
}

function cleanCompressed(dir) {
  if (!fs.existsSync(dir)) return;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = `${dir}/${item.name}`;
    if (item.isDirectory()) {
      cleanCompressed(full);
    } else if (/\.(br|gz|zst)$/.test(item.name)) {
      fs.unlinkSync(full);
    }
  }
}

cleanCompressed("views");
console.log("✓ Local workspace cleaned of all build artifacts");
