import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

// Directories stripped by default (CLI args override). views/js is skipped:
// it is an esbuild bundle artifact, regenerated on every build.
export const STRIP_TARGETS = ["src", "views"];

const JS_INCLUDE_RE = /\.(?:ts|tsx|js|mjs)$/;
const EXCLUDED_RE = /^views\/js(?:\/|$)/;

export function collectFiles(dirs = STRIP_TARGETS) {
  const files = [];
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, item.name);
      const rel = path.relative(process.cwd(), full).split(path.sep).join("/");
      if (item.isDirectory()) {
        if (!EXCLUDED_RE.test(rel)) walk(full);
      } else if (JS_INCLUDE_RE.test(item.name)) {
        files.push(full);
      }
    }
  };
  for (const dir of dirs) walk(path.resolve(dir));
  return files;
}

/**
 * Hand-written comment stripper for JS/TS/TSX  a character-level state
 * machine, no third-party parser. It tracks strings ('' "" `` with ${}
 * nesting), and disambiguates regex literals from division using the
 * previous significant character/keyword. JSX closing tags (`</div>`) and
 * self-closing tags are safe because `<`, `>` and `/` are NOT treated as
 * regex starters.
 */
export function stripJsComments(source) {
  const KEYWORD_STARTERS = new Set([
    "return", "typeof", "instanceof", "in", "of", "new", "delete", "void",
    "throw", "case", "do", "else", "yield", "await",
  ]);
  const REGEX_STARTER_PUNCT = new Set([
    "(", ",", "=", ":", "{", "[", "!", "&", "|", "?", ";", "+", "-", "*",
    "%", "~", "^", "\n",
  ]);

  let out = "";
  let i = 0;
  const n = source.length;
  // Stack: template-literal nesting. Each entry counts open `${` inside one
  // backtick literal; `}` pops back into the template when it reaches 0.
  const templateStack = [];
  let lastSignificant = "\n"; // start of file behaves like after a newline
  let lastWord = "";

  const push = (chars) => {
    out += chars;
    if (chars.trim().length > 0) {
      for (let k = chars.length - 1; k >= 0; k--) {
        if (!/\s/.test(chars[k])) {
          lastSignificant = chars[k];
          break;
        }
      }
    }
  };

  while (i < n) {
    const ch = source[i];
    const next = source[i + 1];

    // ---- template literal ----
    if (templateStack.length > 0 && ch === "`") {
      templateStack.pop();
      push("`");
      i++;
      continue;
    }
    if (ch === "`") {
      templateStack.push(0);
      push("`");
      i++;
      continue;
    }
    if (templateStack.length > 0) {
      const depth = templateStack[templateStack.length - 1];
      if (ch === "$" && next === "{") {
        templateStack[templateStack.length - 1] = depth + 1;
        push("${");
        i += 2;
        continue;
      }
      if (ch === "}" && depth > 0) {
        templateStack[templateStack.length - 1] = depth - 1;
        push("}");
        i++;
        continue;
      }
      if (ch === "\\") {
        push(source.slice(i, i + 2));
        i += 2;
        continue;
      }
      push(ch);
      i++;
      continue;
    }

    // ---- comments ----
    if (ch === "/" && next === "/") {
      i += 2;
      while (i < n && source[i] !== "\n") i++;
      continue; // drop comment, keep newline handling to caller loop
    }
    if (ch === "/" && next === "*") {
      i += 2;
      while (i < n && !(source[i] === "*" && source[i + 1] === "/")) i++;
      i += 2;
      out += " "; // keep token separation where a comment stood
      continue;
    }

    // ---- strings ----
    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < n && source[j] !== ch) {
        if (source[j] === "\\") j++;
        j++;
      }
      push(source.slice(i, j + 1));
      i = j + 1;
      continue;
    }

    // ---- regex literal ----
    if (ch === "/" && isRegexStart(lastSignificant, lastWord, KEYWORD_STARTERS, REGEX_STARTER_PUNCT)) {
      let j = i + 1;
      let inClass = false;
      let closed = false;
      while (j < n) {
        const c = source[j];
        if (c === "\\") {
          j += 2;
          continue;
        }
        if (c === "[") inClass = true;
        else if (c === "]") inClass = false;
        else if (c === "/" && !inClass) {
          closed = true;
          break;
        } else if (c === "\n") break;
        j++;
      }
      if (closed) {
        j++;
        while (j < n && /[a-z]/.test(source[j])) j++; // flags
        push(source.slice(i, j));
        i = j;
        continue;
      }
      // not a valid regex  fall through as division
    }

    // ---- word tracking for keyword lookbehind ----
    if (/[A-Za-z_$]/.test(ch)) {
      let j = i;
      while (j < n && /[\w$]/.test(source[j])) j++;
      lastWord = source.slice(i, j);
      push(source.slice(i, j));
      i = j;
      continue;
    }
    if (!/\s/.test(ch) || ch === "\n") {
      if (!/[\w$]/.test(ch)) lastWord = "";
    }

    push(ch);
    i++;
  }

  return out
    .replace(/[ \t]+\n/g, "\n") // trailing spaces left by dropped comments
    .replace(/\n{3,}/g, "\n\n");
}

function isRegexStart(prevChar, prevWord, keywords, punctuators) {
  if (prevChar === undefined || prevChar === "\n") return true;
  if (prevChar === ".") return true; // after property access never division? `.` means member  regex impossible after value; but `foo./re/` invalid anyway
  if (/[\w$)"'\]`]/.test(prevChar)) {
    // After a value/identifier  division, UNLESS preceded by a keyword that
    // takes an expression (return /re/, typeof /re/, ...).
    return keywords.has(prevWord);
  }
  return punctuators.has(prevChar);
}

/** Remove /* *​/ comments from CSS, preserving quoted strings. */
export function stripCssComments(source) {
  let out = "";
  let i = 0;
  const n = source.length;
  while (i < n) {
    const ch = source[i];
    if (ch === "/" && source[i + 1] === "*") {
      let j = i + 2;
      while (j < n && !(source[j] === "*" && source[j + 1] === "/")) j++;
      i = j + 2;
      out += " ";
      continue;
    }
    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < n && source[j] !== ch) {
        if (source[j] === "\\") j++;
        j++;
      }
      out += source.slice(i, j + 1);
      i = j + 1;
      continue;
    }
    out += ch;
    i++;
  }
  return out.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n");
}

/** Remove <!-- --> comments from HTML (inline <script> content untouched). */
export function stripHtmlComments(source) {
  return source.replace(/<!--[\s\S]*?-->/g, "").replace(/\n{3,}/g, "\n\n");
}

export function stripFile(file) {
  const content = fs.readFileSync(file, "utf8");
  try {
    let cleaned;
    if (file.endsWith(".html")) {
      cleaned = stripHtmlComments(content);
    } else if (file.endsWith(".css")) {
      cleaned = stripCssComments(content);
    } else {
      cleaned = stripJsComments(content);
    }
    cleaned = `${cleaned.trim()}\n`;
    if (cleaned !== content) {
      fs.writeFileSync(file, cleaned, "utf8");
      return true;
    }
  } catch (err) {
    console.error(`✗ Failed ${file}:`, err.message);
  }
  return false;
}

export async function stripAll(dirs = STRIP_TARGETS) {
  const files = collectFiles(dirs);
  let count = 0;
  for (const file of files) {
    if (stripFile(file)) count++;
  }
  return { count, total: files.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const { count, total } = await stripAll(args.length > 0 ? args : STRIP_TARGETS);
  console.log(`\nFinished: ${count} of ${total} file(s) decommented.`);
}
