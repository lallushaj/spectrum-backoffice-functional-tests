const dotenv = require('dotenv');
const { chromium, expect } = require('@playwright/test');

dotenv.config();

async function clickNoIfPrompted(page) {
  const prompt = page.getByText(/stay signed in/i);
  await prompt.waitFor({ state: 'visible', timeout: 30000 }).catch(() => undefined);
  if (await page.getByRole('button', { name: /^no$/i }).isVisible().catch(() => false)) {
    await page.getByRole('button', { name: /^no$/i }).click();
    await prompt.waitFor({ state: 'hidden', timeout: 30000 }).catch(() => undefined);
  }
}

async function login(page) {
  await page.goto(process.env.SBPOJECT_URL);
  const username = page.locator('input[type="email"], input[name="loginfmt"], input[autocomplete="username"]').first();
  const password = page.locator('input[type="password"], input[name="passwd"]').first();
  await username.or(password).first().waitFor({ state: 'visible', timeout: 30000 });
  if (await username.isVisible().catch(() => false)) {
    await username.fill(process.env.SBPOJECT_USERNAME);
    await page.getByRole('button', { name: /next|continue/i }).first().click();
  }
  await password.waitFor({ state: 'visible', timeout: 30000 });
  await password.fill(process.env.SBPOJECT_PASSWORD);
  await expect.poll(async () => (await password.inputValue()).length).toBe(process.env.SBPOJECT_PASSWORD.length);
  await page.getByRole('button', { name: /sign in|login/i }).first().click();
  await clickNoIfPrompted(page);
}

async function openSpectrum(page) {
  await page.getByText(/entitlements/i).first().waitFor({ state: 'visible', timeout: 60000 });
  await page.getByRole('button', { name: /switch app/i }).click();
  const newPagePromise = page.context().waitForEvent('page', { timeout: 30000 }).catch(() => undefined);
  await page.getByText('Spectrum Booking', { exact: true }).click();
  const spectrumPage = (await newPagePromise) || page;
  await expect(spectrumPage).toHaveTitle(/Spectrum Back Office/i, { timeout: 60000 });
  return spectrumPage;
}

async function summarize(page) {
  return page.evaluate(() => {
    function isVisible(element) {
      const style = window.getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.visibility !== 'hidden' && style.display !== 'none' && box.width > 0 && box.height > 0;
    }

    function cleanText(element) {
      return (element.textContent || '').replace(/\s+/g, ' ').trim();
    }

    const controls = Array.from(document.querySelectorAll('button,a,input,[role="button"],[role="link"],[role="menuitem"],[aria-label]')).map((element) => ({
      tag: element.tagName,
      role: element.getAttribute('role'),
      type: element.getAttribute('type'),
      text: cleanText(element),
      ariaLabel: element.getAttribute('aria-label'),
      href: element instanceof HTMLAnchorElement ? element.href : null,
      visible: isVisible(element)
    }));

    return {
      url: location.href,
      title: document.title,
      bodyText: cleanText(document.body).slice(0, 4000),
      visibleControls: controls.filter((control) => control.visible && (control.text || control.ariaLabel)),
      fileInputs: Array.from(document.querySelectorAll('input[type="file"]')).map((element) => ({
        name: element.getAttribute('name'),
        id: element.getAttribute('id'),
        accept: element.getAttribute('accept'),
        visible: isVisible(element)
      })),
      importCandidates: controls.filter((control) => /import|template|upload|download|new|request/i.test(`${control.text} ${control.ariaLabel || ''}`))
    };
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await login(page);
  const spectrumPage = await openSpectrum(page);
  await spectrumPage.getByText('Import List', { exact: true }).click();
  await spectrumPage.getByRole('heading', { name: 'Import List', exact: true }).waitFor({ state: 'visible', timeout: 30000 });
  await spectrumPage.screenshot({ path: 'reports/bulk-import-live.png', fullPage: true });
  console.log('IMPORT_LIST_SUMMARY');
  console.log(JSON.stringify(await summarize(spectrumPage), null, 2));

  const firstProcess = spectrumPage.locator('a').filter({ hasText: /^[0-9a-f-]{36}$/i }).first();
  if (await firstProcess.isVisible().catch(() => false)) {
    const processId = (await firstProcess.innerText()).trim();
    console.log('CLICKING_PROCESS_ID', processId);
    await firstProcess.click();
    await spectrumPage.waitForLoadState('domcontentloaded').catch(() => undefined);
    await spectrumPage.waitForTimeout(2000);
    await spectrumPage.screenshot({ path: 'reports/bulk-import-detail-live.png', fullPage: true });
    console.log('IMPORT_DETAIL_SUMMARY');
    console.log(JSON.stringify(await summarize(spectrumPage), null, 2));

    const importFile = spectrumPage.getByRole('button', { name: /import file/i });
    if (await importFile.isVisible().catch(() => false)) {
      const downloadPromise = spectrumPage.waitForEvent('download', { timeout: 15000 }).catch(() => undefined);
      await importFile.click();
      const download = await downloadPromise;
      console.log('IMPORT_FILE_DOWNLOAD', download ? download.suggestedFilename() : 'no download event');
      await spectrumPage.waitForTimeout(1000);
      await spectrumPage.screenshot({ path: 'reports/bulk-import-after-import-file-click.png', fullPage: true });
    }
  }
  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});