import { expect } from '@playwright/test';
import { Page } from './Page';
import type { Page as PlaywrightPage } from 'playwright';

export class EntitlementsPage extends Page {
  async waitUntilLoaded(): Promise<void> {
    await expect(this.page.getByText(/entitlements/i).first()).toBeVisible({ timeout: 30000 });
  }

  async switchApp(): Promise<PlaywrightPage> {
    const switchApp = this.page.getByRole('button', { name: /switch app/i });
    await expect(switchApp).toBeVisible({ timeout: 30000 });
    await switchApp.click();

    const spectrumApp = this.page.getByText('Spectrum Booking', { exact: true });
    await expect(spectrumApp).toBeVisible({ timeout: 30000 });

    await Promise.all([
      this.page.context().waitForEvent('page', { timeout: 30000 }).catch(() => undefined),
      spectrumApp.click({ force: true })
    ]);

    await expect
      .poll(async () => {
        for (const page of this.page.context().pages()) {
          if ((await page.title().catch(() => '')).match(/Spectrum Back Office/i)) return page;
        }
        return undefined;
      }, { timeout: 60000 })
      .toBeTruthy();

    let spectrumPage: PlaywrightPage | undefined;
    for (const page of this.page.context().pages()) {
      if ((await page.title().catch(() => '')).match(/Spectrum Back Office/i)) {
        spectrumPage = page;
        break;
      }
    }
    if (!spectrumPage) throw new Error('Spectrum Back Office page did not open after selecting Spectrum Booking');

    await spectrumPage.waitForLoadState('domcontentloaded').catch(() => undefined);
    return spectrumPage;
  }
}
