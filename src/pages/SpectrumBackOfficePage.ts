import { expect } from '@playwright/test';
import { Page } from './Page';

export class SpectrumBackOfficePage extends Page {
  async selectFromAppSwitcher(): Promise<void> {
    await this.page.getByRole('menuitem', { name: 'Spectrum Booking', exact: true }).click();
  }

  async waitUntilLoaded(): Promise<void> {
    await expect(this.page).toHaveTitle(/Spectrum Back Office/i, { timeout: 30000 });
    await expect(this.page.getByText('Requests', { exact: true })).toBeVisible({ timeout: 30000 });
  }

  async openModule(name: 'Requests' | 'Appointments' | 'Entities' | 'Venues' | 'Import' | 'Reports' | 'Disciplines' | 'Organizations' | 'Organizations Types' | 'System Settings' | 'General Settings' | 'Communication Settings' | 'Commands' | 'Venue Settings'): Promise<void> {
    if (name === 'Disciplines') {
      await this.page.getByText('Entities', { exact: true }).click();
      await expect(this.page.getByText('Disciplines', { exact: true })).toBeVisible();
      await this.page.getByText('Disciplines', { exact: true }).click();
      return;
    }

    if (name === 'Venues') {
      await this.page.getByText('Entities', { exact: true }).click();
      await expect(this.page.getByText('Venues', { exact: true })).toBeVisible();
      await this.page.getByText('Venues', { exact: true }).click();
      return;
    }

    const menuName = name === 'Import' ? 'Import List' : name;
    await this.page.getByText(menuName, { exact: true }).click();
  }
}
