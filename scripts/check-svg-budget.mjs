#!/usr/bin/env node
// check-svg-budget.mjs — validate SVG spec: viewBox, currentColor, ≤3 KB, <title>+<desc>,
//   no <script>, no external href.
// Usage:
//   node scripts/check-svg-budget.mjs <dir-or-file...>
//   node scripts/check-svg-budget.mjs --self-test

import { readFileSync, statSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const DEFAULT_DIR = 'src/assets/diagrams';
const MAX_BYTES = 3 * 1024;
const GLOBAL_MAX = 15;
const VIEWBOX = '0 0 512 320';

function walk(p) {
  const st = statSync(p);
  if (st.isFile()) return [p];
  const out = [];
  for (const name of readdirSync(p)) {
    out.push(...walk(join(p, name)));
  }
  return out;
}

function checkSvg(abs) {
  const src = readFileSync(abs, 'utf8');
  const size = Buffer.byteLength(src, 'utf8');
  const issues = [];
  if (size > MAX_BYTES) issues.push({ issue: 'over-size', bytes: size });
  if (!src.includes(`viewBox="${VIEWBOX}"`)) issues.push({ issue: 'bad-viewbox', expected: VIEWBOX });
  if (/#[0-9A-Fa-f]{3,8}\b/.test(src)) issues.push({ issue: 'hardcoded-hex' });
  if (!src.includes('currentColor')) issues.push({ issue: 'no-currentcolor' });
  if (!/<title[\s>]/.test(src)) issues.push({ issue: 'no-title' });
  if (!/<desc[\s>]/.test(src)) issues.push({ issue: 'no-desc' });
  if (/<script[\s>]/.test(src)) issues.push({ issue: 'has-script' });
  if (/(href|xlink:href)\s*=\s*"https?:\/\//.test(src)) issues.push({ issue: 'external-href' });
  if (/<font[\s>]|font-family/.test(src)) issues.push({ issue: 'has-font' });
  return { path: abs, ok: issues.length === 0, bytes: size, issues };
}

function runSelfTest() {
  const dir = resolve(__dirname, '__fixtures__/check-svg');
  const cases = [
    { path: join(dir, 'pass.svg'), expect: true },
    { path: join(dir, 'fail.svg'), expect: false },
  ];
  let ok = 0;
  for (const c of cases) {
    if (!existsSync(c.path)) { console.log(`[self-test] ${c.path} MISSING`); continue; }
    const r = checkSvg(c.path);
    const pass = r.ok === c.expect;
    console.log(`[self-test] ${c.path} expect=${c.expect} got=${r.ok} ${pass ? 'OK' : 'FAIL'}${r.ok ? '' : ' ' + JSON.stringify(r.issues)}`);
    if (pass) ok++;
  }
  return ok === cases.length ? 0 : 1;
}

const args = process.argv.slice(2);
if (args.includes('--self-test')) process.exit(runSelfTest());

const targets = args.length ? args : [DEFAULT_DIR];
const files = [];
for (const t of targets) {
  const abs = resolve(REPO_ROOT, t);
  if (!existsSync(abs)) continue;
  files.push(...walk(abs).filter((f) => extname(f).toLowerCase() === '.svg'));
}

if (files.length > GLOBAL_MAX) {
  console.log(`FAIL global svg count ${files.length} > ${GLOBAL_MAX}`);
  process.exit(1);
}

const reports = files.map(checkSvg);
const failed = reports.filter((r) => !r.ok);
for (const r of reports) {
  if (r.ok) console.log(`OK   ${r.path} (${r.bytes}B)`);
  else {
    console.log(`FAIL ${r.path} (${r.bytes}B)`);
    for (const i of r.issues) console.log(`   - ${i.issue}${i.bytes ? ' ' + i.bytes + 'B' : ''}`);
  }
}
console.log(`total=${files.length}/${GLOBAL_MAX}`);
process.exit(failed.length === 0 ? 0 : 1);
