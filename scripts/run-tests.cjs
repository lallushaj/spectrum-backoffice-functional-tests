#!/usr/bin/env node
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

function findNodeExecutable() {
  const candidates = [];

  if (process.platform === 'win32') {
    const envPath = process.env.PATH || '';
    const segments = envPath.split(path.delimiter).filter(Boolean);
    segments.forEach((segment) => {
      candidates.push(path.join(segment, 'node.exe'));
      candidates.push(path.join(segment, 'node'));
    });
    candidates.push('C:/Program Files/nodejs/node.exe');
    candidates.push('C:/Program Files/nodejs/node');
  } else {
    candidates.push('/usr/local/bin/node', '/usr/bin/node', '/bin/node');
  }

  for (const candidate of candidates) {
    if (!candidate) continue;
    try {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    } catch {
      // ignore
    }
  }

  return process.platform === 'win32' ? 'node.exe' : 'node';
}

const requiredEnv = ['SBPOJECT_URL', 'SBPOJECT_USERNAME', 'SBPOJECT_PASSWORD'];
const missingEnv = requiredEnv.filter((name) => !process.env[name] || !String(process.env[name]).trim());

if (missingEnv.length > 0) {
  console.error('Missing required Spectrum environment variables: ' + missingEnv.join(', '));
  console.error('Set them before running the feature, for example:');
  console.error('  $env:SBPOJECT_URL="https://..."');
  console.error('  $env:SBPOJECT_USERNAME="user@example.com"');
  console.error('  $env:SBPOJECT_PASSWORD="your-password"');
  process.exit(1);
}

const args = process.argv.slice(2);
const nodeExecutable = findNodeExecutable();
const cucumberJs = path.join(process.cwd(), 'node_modules', '.bin', process.platform === 'win32' ? 'cucumber-js.cmd' : 'cucumber-js');

process.env.HEADED = 'false';

const cucumber = spawnSync(nodeExecutable, [cucumberJs, ...args], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
  env: process.env,
});

const cucumberExit = cucumber.status ?? (cucumber.error ? 1 : 0);
process.exit(cucumberExit);
