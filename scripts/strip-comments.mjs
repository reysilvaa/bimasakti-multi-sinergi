import fs from "node:fs";
import path from "node:path";
import decomment from "decomment";

function walk(dir) {
  let files = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      files = files.concat(walk(fullPath));
    } else if (item.isFile() && (item.name.endsWith(".ts") || item.name.endsWith(".js"))) {
      files.push(fullPath);
    }
  }
  return files;
}

const targetDir = process.argv[2] || "src";
const files = walk(path.resolve(targetDir));
let count = 0;

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  try {
    const stripped = decomment(content, { trim: true });
    // Normalize excessive blank lines (max 1 empty line)
    const cleaned = stripped.replace(/\n{3,}/g, "\n\n").trim() + "\n";
    if (cleaned !== content) {
      fs.writeFileSync(file, cleaned, "utf8");
      count++;
      console.log(`✓ Decommented: ${path.relative(process.cwd(), file)}`);
    }
  } catch (err) {
    console.error(`✗ Failed ${file}:`, err.message);
  }
}

console.log(`\nFinished: ${count} file(s) decommented.`);
