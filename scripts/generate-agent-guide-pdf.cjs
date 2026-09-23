#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'docs', 'spectrum-backoffice-ai-agents-guide.html');
const pdfPath = path.join(root, 'docs', 'spectrum-backoffice-ai-agents-guide.pdf');

async function main() {
  if (!fs.existsSync(htmlPath)) throw new Error(`Guide source not found: ${htmlPath}`);
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(`file://${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'load' });
    await page.pdf({ path: pdfPath, format: 'A4', printBackground: true, preferCSSPageSize: true });
  } finally {
    await browser.close();
  }
  console.log(`Created ${path.relative(root, pdfPath)}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
