import { expect, type Locator, type Page as PlaywrightPage } from '@playwright/test';

export abstract class Page {
  constructor(protected readonly page: PlaywrightPage) {}

  protected async click(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
    await locator.click();
  }

  protected async fill(locator: Locator, value: string): Promise<void> {
    await expect(locator).toBeVisible();
    await locator.fill(value);
  }

  async expectText(text: string): Promise<void> {
    await expect(this.page.getByText(text, { exact: false }).first()).toBeVisible();
  }
}
