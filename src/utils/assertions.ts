import { expect, type Page } from '@playwright/test';

export async function expectNotification(page: Page, text = /success|created|updated|deleted/i): Promise<void> {
  await expect(page.getByText(text).first()).toBeVisible();
}

export async function expectValidation(page: Page): Promise<void> {
  await expect(page.locator('[aria-invalid="true"], .p-error, [role="alert"]').first()).toBeVisible();
}
