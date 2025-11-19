#!/usr/bin/env node
const { spawn } = require('child_process');

const args = process.argv.slice(2);
const soft = args.includes('--soft') || process.env.SMOKE_SOFT === '1';

console.log('Running Playwright smoke (soft mode =', !!soft, ')');

const child = spawn('npx', ['playwright', 'test', 'smoke-test/playwright.spec.mjs'], {
  stdio: 'inherit',
  shell: true
});

child.on('exit', (code) => {
  if (soft) {
    console.log('Soft mode enabled — exiting 0 even if tests failed (child code:', code, ')');
    process.exit(0);
  }
  process.exit(code);
});
