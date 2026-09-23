import dotenv from 'dotenv';
import { chromium, expect, type Page } from '@playwright/test';

dotenv.config();

async function login(page: Page): Promise<void> {
  await page.goto(process.env.SBPOJECT_URL ?? '');

  const username = page.locator('input[type="email"], input[name="loginfmt"], input[autocomplete="username"]').first();
  const password = page.locator('input[type="password"], input[name="passwd"]').first();
  await expect(username.or(password).first()).toBeVisible({ timeout: 30000 });

  if (await username.isVisible().catch(() => false)) {
    await username.fill(process.env.SBPOJECT_USERNAME ?? '');
    await page.getByRole('button', { name: /next|continue/i }).first().click();
  }

  await expect(password).toBeVisible({ timeout: 30000 });
  await password.fill(process.env.SBPOJECT_PASSWORD ?? '');
  await page.getByRole('button', { name: /sign in|login/i }).first().click();

  const staySignedInPrompt = page.getByText(/stay signed in/i);
  const staySignedInNo = page.getByRole('button', { name: /^no$/i });
  await staySignedInPrompt.waitFor({ state: 'visible', timeout: 30000 }).catch(() => undefined);
  if (await staySignedInNo.isVisible().catch(() => false)) {
    await staySignedInNo.click();
    await staySignedInPrompt.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => undefined);
  }
}

async function switchToSpectrum(page: Page): Promise<Page> {
  await expect(page.getByRole('button', { name: /switch app/i })).toBeVisible({ timeout: 60000 });
  await page.getByRole('button', { name: /switch app/i }).click();
  await expect(page.getByText('Spectrum Booking', { exact: true })).toBeVisible({ timeout: 30000 });

  const newPagePromise = page.context().waitForEvent('page', { timeout: 30000 });
  await page.getByText('Spectrum Booking', { exact: true }).click();
  const spectrumPage = await newPagePromise;
  await expect(spectrumPage).toHaveTitle(/Spectrum Back Office/i, { timeout: 60000 });
  return spectrumPage;
}

async function visibleControls(page: Page): Promise<void> {
  console.log('URL:', page.url());
  console.log('Title:', await page.title());
  console.log('Visible text:');
  console.log((await page.locator('body').innerText()).slice(0, 1500));

  const controls = await page.locator('a, button, input, [role="button"], [role="menuitem"]').evaluateAll((elements) =>
    elements.map((element) => {
      const text = (element.textContent ?? '').replace(/\s+/g, ' ').trim();
      return {
      tag: element.tagName,
      role: element.getAttribute('role'),
      type: element.getAttribute('type'),
      text,
      aria: element.getAttribute('aria-label'),
      title: element.getAttribute('title'),
      href: element instanceof HTMLAnchorElement ? element.href : null,
      hidden: element instanceof HTMLElement ? element.offsetParent === null : false
      };
    }).filter((control) => /import|template|upload|download|new|create|request|process|status|finished|processing/i.test(`${control.text} ${control.aria ?? ''} ${control.title ?? ''} ${control.type ?? ''}`)).slice(0, 80)
  );
  const fileInputs = await page.locator('input[type="file"]').count();
  console.log('File input count:', fileInputs);
  console.log('Candidate controls:');
  console.log(JSON.stringify(controls, null, 2));
}

async function main(): Promise<void> {
  const browser = await chromium.launch({ headless: false, slowMo: 400 });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  await login(page);
  const spectrumPage = await switchToSpectrum(page);
  await spectrumPage.getByText('Import List', { exact: true }).click();
  await expect(spectrumPage).toHaveURL(/\/app\/sbp\/bulk\/requests/i, { timeout: 30000 });
  await spectrumPage.screenshot({ path: 'reports/bulk-import-list-live.png', fullPage: true });
  await visibleControls(spectrumPage);

  const firstProcess = spectrumPage.locator('tbody tr a, tbody tr button, tbody tr [role="button"]').first();
  if (await firstProcess.isVisible().catch(() => false)) {
    await firstProcess.click();
    await spectrumPage.waitForLoadState('domcontentloaded').catch(() => undefined);
    await spectrumPage.screenshot({ path: 'reports/bulk-import-detail-live.png', fullPage: true });
    console.log('After opening first process:');
    await visibleControls(spectrumPage);

    const importFile = spectrumPage.getByText('Import File', { exact: true });
    if (await importFile.isVisible().catch(() => false)) {
      const downloadPromise = spectrumPage.waitForEvent('download', { timeout: 15000 }).catch(() => undefined);
      await importFile.click();
      const download = await downloadPromise;
      console.log('Import File download:', download ? download.suggestedFilename() : 'no download event');
    }
  }

  console.log('Inspection complete. Closing browser.');
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});