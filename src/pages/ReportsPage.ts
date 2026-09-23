import { expect, type Locator } from '@playwright/test';
import { Page } from './Page';

export class ReportsPage extends Page {
  private get reportFrame(): Locator {
    return this.page.frameLocator('iframe').locator('body');
  }

  private get searchInput(): Locator {
    return this.page.frameLocator('iframe').getByPlaceholder('Search...');
  }

  async waitUntilLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Reports', exact: true })).toBeVisible();
    await expect(this.page.frameLocator('iframe').getByRole('columnheader', { name: 'Title', exact: true })).toBeVisible();
  }

  async expectEmbeddedTable(): Promise<void> {
    await expect(this.reportFrame).toBeVisible();
  }

  async expectColumns(): Promise<void> {
    for (const column of ['Title', 'Tags', 'Created', 'Updated']) {
      await expect(this.page.frameLocator('iframe').getByRole('columnheader', { name: column, exact: true })).toBeVisible();
    }
  }

  async search(value: string): Promise<void> {
    await this.searchInput.fill(value);
    await this.searchInput.press('Enter');
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.fill('');
    await this.searchInput.press('Enter');
  }

  async expectNoData(): Promise<void> {
    await expect(this.page.frameLocator('iframe').getByText('No data available.', { exact: true })).toBeVisible();
  }

  async sortBy(column: 'Title' | 'Created' | 'Updated', direction: 'ascending' | 'descending'): Promise<void> {
    const header = this.page.frameLocator('iframe').getByRole('columnheader', { name: column, exact: true });
    await header.click();
    if (direction === 'descending') await header.click();
  }

  async refresh(): Promise<void> {
    await this.page.frameLocator('iframe').getByRole('button', { name: 'refresh-button' }).click();
  }

  async expectSearchControl(): Promise<void> {
    await expect(this.searchInput).toBeVisible();
    await expect(this.page.frameLocator('iframe').getByRole('button', { name: 'activate search' })).toBeVisible();
  }
}
