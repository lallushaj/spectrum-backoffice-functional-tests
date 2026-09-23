import { expect, type Page } from '@playwright/test';

export async function expectTableContains(page: Page, value: string): Promise<void> {
  await expect(page.locator('table').getByText(value, { exact: false })).toBeVisible();
}

export async function expectTableEmpty(page: Page): Promise<void> {
  await expect(page.locator('table').getByText(/no results|no data|empty/i)).toBeVisible();
}
