// Minimal MDX helpers for check-* scripts.
// Node ESM, no deps.
import { readFileSync } from 'node:fs';

/** Split frontmatter and body from MDX source. Returns { frontmatter: string, body: string }. */
export function splitFrontmatter(src) {
  if (!src.startsWith('---\n')) return { frontmatter: '', body: src };
  const end = src.indexOf('\n---\n', 4);
  if (end === -1) return { frontmatter: '', body: src };
  return {
    frontmatter: src.slice(4, end),
    body: src.slice(end + 5),
  };
}

/** Very small YAML parser: supports top-level scalars + `key:` block with `- ...` list items
 *  and nested `{key: value, ...}` objects on a single line. Enough for our frontmatter.
 */
export function parseFrontmatter(yaml) {
  const out = {};
  if (!yaml) return out;
  const lines = yaml.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) { i++; continue; }
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (!m) { i++; continue; }
    const key = m[1];
    const rest = m[2];
    if (rest === '') {
      // Expect list block
      const list = [];
      i++;
      while (i < lines.length) {
        const l = lines[i];
        if (l.startsWith('  - ')) {
          const val = l.slice(4).trim();
          if (val.startsWith('{') && val.endsWith('}')) {
            list.push(parseInlineObject(val));
          } else {
            list.push(unquote(val));
          }
          i++;
        } else if (l.startsWith('    ')) {
          // Multi-line object continuation: gather following indented lines until next list item
          // Not needed for now; treat as string append.
          i++;
        } else {
          break;
        }
      }
      out[key] = list;
    } else {
      out[key] = unquote(rest);
      i++;
    }
  }
  return out;
}

function unquote(s) {
  const t = s.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    return t.slice(1, -1);
  }
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
  if (t === 'true') return true;
  if (t === 'false') return false;
  return t;
}

function parseInlineObject(src) {
  // Strip surrounding braces, split by top-level commas.
  const inner = src.slice(1, -1);
  const parts = [];
  let buf = '';
  let depth = 0;
  let inStr = null;
  for (const ch of inner) {
    if (inStr) {
      buf += ch;
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === '"' || ch === "'") { inStr = ch; buf += ch; continue; }
    if (ch === '{' || ch === '[') depth++;
    if (ch === '}' || ch === ']') depth--;
    if (ch === ',' && depth === 0) { parts.push(buf); buf = ''; continue; }
    buf += ch;
  }
  if (buf.trim()) parts.push(buf);
  const obj = {};
  for (const p of parts) {
    const kv = p.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    obj[kv[1]] = unquote(kv[2]);
  }
  return obj;
}

/** Return array of { start, end, content } for every `$$...$$` display-math block in body. */
export function findDisplayMathBlocks(body) {
  const blocks = [];
  const lines = body.split(/\r?\n/);
  let open = -1;
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed === '$$') {
      if (open === -1) open = i;
      else {
        blocks.push({
          start: open,
          end: i,
          content: lines.slice(open + 1, i).join('\n'),
        });
        open = -1;
      }
    } else {
      // inline `$$...$$` on same line
      const single = lines[i].match(/\$\$(.+?)\$\$/);
      if (single && open === -1) {
        blocks.push({ start: i, end: i, content: single[1] });
      }
    }
  }
  return blocks;
}

/** Read MDX file and return { src, frontmatter: obj, body }. */
export function readMdx(path) {
  const src = readFileSync(path, 'utf8');
  const { frontmatter, body } = splitFrontmatter(src);
  return { src, frontmatter: parseFrontmatter(frontmatter), body };
}
