#!/usr/bin/env node
// check-notation.mjs — assert every Tier A symbol is declared in 00-notation.mdx
// Usage:
//   node scripts/check-notation.mjs <file...>
//   node scripts/check-notation.mjs --tier=a [--strict]
//   node scripts/check-notation.mjs --self-test

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readMdx } from './lib/mdx-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const NOTATION_PATH = 'src/content/docs/01-rl-fundamentals/00-notation.mdx';

function loadNotationBody() {
  const abs = resolve(REPO_ROOT, NOTATION_PATH);
  if (!existsSync(abs)) return null;
  const { body } = readMdx(abs);
  return body;
}

// Composite / high-fidelity symbols only. Bare greek letters (pi, theta, sigma, etc.)
// are tracked implicitly via their composite forms to avoid substring-match false positives.
const TRACKED_SYMBOLS = [
  'r_t', '\\gamma', '\\beta', 'D_{KL}', 'A_t', 'G_t', 's_t', 'a_t', '\\rho',
  '\\pi_\\theta', '\\pi_{ref}', '\\sigma', 'y_w', 'y_l',
  '\\hat{A}_i', '\\epsilon',
];

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function checkFile(relPath, notationBody, { strict }) {
  const abs = resolve(REPO_ROOT, relPath);
  if (!existsSync(abs)) return { path: relPath, ok: false, reason: 'missing' };
  const { body } = readMdx(abs);
  const warnings = [];
  for (const sym of TRACKED_SYMBOLS) {
    const useRe = new RegExp(`(?<![A-Za-z0-9_\\\\])${escapeRegex(sym)}(?![A-Za-z0-9_])`);
    if (useRe.test(body)) {
      // "declared" ⇔ the literal symbol string appears anywhere in notation body.
      const declaredRe = new RegExp(escapeRegex(sym));
      if (!declaredRe.test(notationBody)) warnings.push({ symbol: sym, issue: 'undeclared' });
    }
  }
  const failed = strict ? warnings.length > 0 : false;
  return { path: relPath, ok: !failed, notation_warnings: warnings };
}

function loadTier(tier) {
  return readFileSync(resolve(REPO_ROOT, `.omc/manifests/tier-${tier}-paths.txt`), 'utf8')
    .split('\n').filter(Boolean);
}

function runSelfTest() {
  // Fixture: fake notation body containing only a subset of symbols.
  const fixturesDir = 'scripts/__fixtures__/check-notation';
  const fakeNotation = 'This fake notation declares \\pi_\\theta, \\pi_{ref}, \\beta, and \\sigma.';
  const cases = [
    { path: `${fixturesDir}/pass.mdx`, expect: true },
    { path: `${fixturesDir}/fail.mdx`, expect: false },
  ];
  let ok = 0;
  for (const c of cases) {
    const r = checkFile(c.path, fakeNotation, { strict: true });
    const pass = r.ok === c.expect;
    console.log(`[self-test] ${c.path} expect=${c.expect} got=${r.ok} ${pass ? 'OK' : 'FAIL'}`);
    if (pass) ok++;
  }
  return ok === cases.length ? 0 : 1;
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('usage: check-notation.mjs <file...> | --tier=a|b [--strict] | --self-test');
  process.exit(2);
}
if (args.includes('--self-test')) process.exit(runSelfTest());

const strict = args.includes('--strict');
const tierArg = args.find((a) => a.startsWith('--tier='));
const files = tierArg ? loadTier(tierArg.split('=')[1]) : args.filter((a) => !a.startsWith('--'));

const notationBody = loadNotationBody();
if (!notationBody) {
  console.error(`notation file missing: ${NOTATION_PATH}`);
  process.exit(strict ? 1 : 0);
}

const reports = files.map((f) => checkFile(f, notationBody, { strict }));
const failed = reports.filter((r) => !r.ok);
for (const r of reports) {
  if (r.ok && (!r.notation_warnings || r.notation_warnings.length === 0)) {
    console.log(`OK   ${r.path}`);
  } else {
    console.log(`${r.ok ? 'WARN' : 'FAIL'} ${r.path}`);
    for (const w of r.notation_warnings || []) console.log(`   - ${w.issue}: ${w.symbol}`);
  }
}
process.exit(failed.length === 0 ? 0 : 1);
