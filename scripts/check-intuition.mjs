#!/usr/bin/env node
// check-intuition.mjs — enforce that every $$...$$ block in Tier A has a
//   `> **직관.**` blockquote within 5 lines OR a `{/* skip-intuition: <≥10 chars> */}` marker.
// Three orthogonal signals on the intuition text:
//   (1) contains a meaning keyword {왜/언제/무엇이/why/when/changes/의미/역할/커진다/줄인다/결정}
//   (2) ≥5 non-math words
//   (3) ≥50% non-math token ratio
//
// Usage:
//   node scripts/check-intuition.mjs <file...>
//   node scripts/check-intuition.mjs --tier=a
//   node scripts/check-intuition.mjs --self-test

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readMdx, findDisplayMathBlocks } from './lib/mdx-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

const KEYWORDS = ['왜', '언제', '무엇이', 'why', 'when', 'changes', '의미', '역할', '커진다', '줄인다', '결정', '해석', '직관적으로'];

function isMathToken(t) {
  return t.startsWith('$') || t.startsWith('\\') || /^[=+\-*/^_<>()[\]{}|]+$/.test(t);
}

function analyzeIntuitionText(text) {
  const tokens = text.split(/\s+/).filter(Boolean);
  const nonMath = tokens.filter((t) => !isMathToken(t));
  const words = nonMath.filter((t) => /[가-힣A-Za-z]{2,}/.test(t));
  const hasKeyword = KEYWORDS.some((k) => text.includes(k));
  const ratio = tokens.length > 0 ? nonMath.length / tokens.length : 0;
  const signals = {
    keyword: hasKeyword,
    words_gte_5: words.length >= 5,
    non_math_ratio_gte_0_5: ratio >= 0.5,
    word_count: words.length,
    non_math_ratio: ratio,
  };
  signals.pass = signals.keyword && signals.words_gte_5 && signals.non_math_ratio_gte_0_5;
  return signals;
}

function scanFile(relPath) {
  const abs = resolve(REPO_ROOT, relPath);
  if (!existsSync(abs)) return { path: relPath, ok: false, reason: 'missing' };
  const { body } = readMdx(abs);
  const lines = body.split(/\r?\n/);
  const blocks = findDisplayMathBlocks(body);
  const issues = [];
  for (const b of blocks) {
    const lookahead = lines.slice(b.end + 1, b.end + 6).join('\n');
    const skipMatch = lookahead.match(/\{\/\*\s*skip-intuition:\s*([^*]{10,}?)\s*\*\/\}/);
    if (skipMatch) continue;
    const intuitionMatch = lookahead.match(/^>\s*\*\*직관\.\*\*\s*([\s\S]*?)(?:\n\n|\n[^>]|$)/m);
    if (!intuitionMatch) {
      issues.push({ line: b.start + 1, issue: 'no-intuition-block' });
      continue;
    }
    const signals = analyzeIntuitionText(intuitionMatch[1].trim());
    if (!signals.pass) {
      issues.push({ line: b.start + 1, issue: 'weak-intuition', signals });
    }
  }
  return { path: relPath, ok: issues.length === 0, math_blocks: blocks.length, issues };
}

function loadTier(tier) {
  return readFileSync(resolve(REPO_ROOT, `.omc/manifests/tier-${tier}-paths.txt`), 'utf8')
    .split('\n').filter(Boolean);
}

function runSelfTest() {
  const fixturesDir = 'scripts/__fixtures__/check-intuition';
  const cases = [
    { path: `${fixturesDir}/pass.mdx`, expect: true },
    { path: `${fixturesDir}/fail.mdx`, expect: false },
  ];
  let ok = 0;
  for (const c of cases) {
    const r = scanFile(c.path);
    const pass = r.ok === c.expect;
    console.log(`[self-test] ${c.path} expect=${c.expect} got=${r.ok} ${pass ? 'OK' : 'FAIL'}`);
    if (!pass) console.log(`   issues: ${JSON.stringify(r.issues)}`);
    if (pass) ok++;
  }
  return ok === cases.length ? 0 : 1;
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('usage: check-intuition.mjs <file...> | --tier=a | --self-test');
  process.exit(2);
}
if (args.includes('--self-test')) process.exit(runSelfTest());

const tierArg = args.find((a) => a.startsWith('--tier='));
const files = tierArg ? loadTier(tierArg.split('=')[1]) : args.filter((a) => !a.startsWith('--'));
const reports = files.map(scanFile);
const failed = reports.filter((r) => !r.ok);
for (const r of reports) {
  if (r.ok) console.log(`OK   ${r.path} (${r.math_blocks} blocks)`);
  else {
    console.log(`FAIL ${r.path}`);
    for (const i of r.issues || []) console.log(`   - line ${i.line}: ${i.issue}${i.signals ? ' ' + JSON.stringify(i.signals) : ''}`);
  }
}
process.exit(failed.length === 0 ? 0 : 1);
