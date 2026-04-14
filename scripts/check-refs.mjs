#!/usr/bin/env node
// check-refs.mjs — verify that `references` in MDX frontmatter use stable primary-source URLs.
// Usage:
//   node scripts/check-refs.mjs <file...>
//   node scripts/check-refs.mjs --tier=a | --tier=b
//   node scripts/check-refs.mjs --self-test
// Exit: 0 all pass, 1 any fail.

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readMdx } from './lib/mdx-utils.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

// Stable primary-source URL patterns.
const STABLE_PATTERNS = [
  /^https?:\/\/arxiv\.org\/abs\/[\w.\/-]+/i,
  /^https?:\/\/(?:dx\.)?doi\.org\/\S+/i,
  /^https?:\/\/[a-z]+\.wikipedia\.org\/.+[?&]oldid=\d+/i,
  /^https?:\/\/spinningup\.openai\.com\//i,
  /^https?:\/\/lilianweng\.github\.io\//i,
  /^https?:\/\/(?:[a-z0-9-]+\.)?deepmind\.(?:com|google)\//i,
  /^https?:\/\/openai\.com\/(?:research|blog|index)\//i,
  /^https?:\/\/blog\.openai\.com\//i,
  /^https?:\/\/ai\.googleblog\.com\//i,
  /^https?:\/\/blog\.google\//i,
  /^https?:\/\/(?:stats|ai|datascience)\.stackexchange\.com\/(?:questions|a)\/\d+/i,
  /^https?:\/\/(?:[a-z0-9-]+\.)?stanford\.edu\//i,
  /^https?:\/\/(?:[a-z0-9-]+\.)?berkeley\.edu\//i,
  /^https?:\/\/incompleteideas\.net\/book\//i,
  /^https?:\/\/(?:www\.)?cs\.cmu\.edu\//i,
  /^https?:\/\/huggingface\.co\/(?:papers|blog)\//i,
  /^https?:\/\/(?:www\.)?nature\.com\/articles\//i,
  /^https?:\/\/proceedings\.(?:mlr\.press|neurips\.cc)\//i,
  /^https?:\/\/papers\.nips\.cc\//i,
  /^https?:\/\/openreview\.net\/forum\?id=/i,
];

function isStable(url) {
  return STABLE_PATTERNS.some((re) => re.test(url));
}

function normalizeRef(ref) {
  if (typeof ref === 'string') return { title: ref, url: ref };
  return ref;
}

function checkFile(relPath) {
  const abs = resolve(REPO_ROOT, relPath);
  if (!existsSync(abs)) return { path: relPath, ok: false, reason: 'missing', refs: [] };
  const { frontmatter } = readMdx(abs);
  const refs = Array.isArray(frontmatter.references) ? frontmatter.references.map(normalizeRef) : [];
  const issues = [];
  for (const r of refs) {
    if (!r.url) { issues.push({ title: r.title, issue: 'no-url' }); continue; }
    if (!isStable(r.url)) issues.push({ url: r.url, issue: 'unstable-source' });
  }
  return { path: relPath, ok: issues.length === 0, ref_count: refs.length, ref_issues: issues };
}

function loadTier(tier) {
  const manifest = resolve(REPO_ROOT, `.omc/manifests/tier-${tier}-paths.txt`);
  return readFileSync(manifest, 'utf8').split('\n').filter(Boolean);
}

function runSelfTest() {
  const cases = [
    { path: 'scripts/__fixtures__/check-refs/pass.mdx', expect: true },
    { path: 'scripts/__fixtures__/check-refs/fail.mdx', expect: false },
  ];
  let passed = 0;
  for (const c of cases) {
    const r = checkFile(c.path);
    const got = r.ok;
    const ok = got === c.expect;
    console.log(`[self-test] ${c.path} expect=${c.expect} got=${got} ${ok ? 'OK' : 'FAIL'}`);
    if (ok) passed++;
  }
  return passed === cases.length ? 0 : 1;
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('usage: check-refs.mjs <file...> | --tier=a|b | --self-test');
  process.exit(2);
}
if (args.includes('--self-test')) process.exit(runSelfTest());

const tierArg = args.find((a) => a.startsWith('--tier='));
const files = tierArg ? loadTier(tierArg.split('=')[1]) : args;

const reports = files.map(checkFile);
const failed = reports.filter((r) => !r.ok);
if (process.env.CHECK_REFS_JSON) {
  console.log(JSON.stringify(reports, null, 2));
} else {
  for (const r of reports) {
    if (r.ok) console.log(`OK   ${r.path} (${r.ref_count} refs)`);
    else {
      console.log(`FAIL ${r.path}`);
      for (const i of r.ref_issues || []) console.log(`   - ${i.issue}: ${i.url || i.title}`);
    }
  }
}
process.exit(failed.length === 0 ? 0 : 1);
