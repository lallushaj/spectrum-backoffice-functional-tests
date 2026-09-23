import { expect } from '@playwright/test';
import { environment } from '../config/environment';
import { Page } from './Page';

export class LoginPage extends Page {
  async open(): Promise<void> {
    await this.page.goto(environment.url);
  }

  async login(): Promise<void> {
    const username = this.page.locator('input[type="email"], input[name="loginfmt"], input[autocomplete="username"]').first();
    const password = this.page.locator('input[type="password"], input[name="passwd"]').first();

    await expect(username.or(password).first()).toBeVisible({ timeout: 30000 });

    if (await username.isVisible().catch(() => false)) {
      await username.fill(environment.username);
      await this.page.getByRole('button', { name: /next|continue/i }).first().click();
    }

    await expect(password).toBeVisible({ timeout: 30000 });
    await password.fill(environment.password);
    if ((await password.inputValue()).length !== environment.password.length) {
      await password.fill('');
      await password.pressSequentially(environment.password);
    }
    await expect.poll(async () => (await password.inputValue()).length).toBe(environment.password.length);
    await this.page.getByRole('button', { name: /sign in|login/i }).first().click();

    const staySignedInPrompt = this.page.getByText(/stay signed in/i);
    const staySignedInNo = this.page.getByRole('button', { name: /^no$/i });
    await staySignedInPrompt.waitFor({ state: 'visible', timeout: 30000 }).catch(() => undefined);
    if (await staySignedInNo.isVisible().catch(() => false)) {
      await staySignedInNo.click();
      await expect(staySignedInPrompt).toBeHidden({ timeout: 30000 });
    }
  }
}
