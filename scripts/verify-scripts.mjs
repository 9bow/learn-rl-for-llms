#!/usr/bin/env node
// verify-scripts.mjs — run self-tests for all check-* scripts.
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const scripts = [
  'check-refs.mjs',
  'check-notation.mjs',
  'check-intuition.mjs',
  'check-svg-budget.mjs',
];

let failed = 0;
for (const s of scripts) {
  const abs = resolve(__dirname, s);
  const r = spawnSync(process.execPath, [abs, '--self-test'], { stdio: 'inherit' });
  if (r.status !== 0) { console.log(`-- ${s}: FAIL`); failed++; }
  else console.log(`-- ${s}: OK`);
}
process.exit(failed === 0 ? 0 : 1);
