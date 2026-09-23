import { expect } from '@playwright/test';
import { Page } from './Page';

export abstract class ReferenceTablePage extends Page {
  async waitUntilLoaded(title: string): Promise<void> {
    await expect(this.page.getByRole('heading', { name: title, exact: true })).toBeVisible();
    await expect(this.page.getByPlaceholder('Search...')).toBeVisible();
  }

  async expectColumns(columns: string[]): Promise<void> {
    for (const column of columns) {
      await expect(this.page.getByRole('columnheader', { name: column, exact: true })).toBeVisible();
    }
  }

  async search(value: string): Promise<void> {
    const search = this.page.getByPlaceholder('Search...');
    await search.fill(value);
    await search.press('Enter');
  }

  async clearSearch(): Promise<void> {
    const search = this.page.getByPlaceholder('Search...');
    await search.fill('');
    await search.press('Enter');
  }

  async expectNoData(): Promise<void> {
    await expect(this.page.getByText('No data available.', { exact: true })).toBeVisible();
  }

  async expectResult(value: string): Promise<void> {
    await expect(this.page.getByText(value, { exact: false }).first()).toBeVisible();
  }

  async sortBy(column: string, direction: 'ascending' | 'descending'): Promise<void> {
    const header = this.page.getByRole('columnheader', { name: column, exact: true });
    await header.click();
    if (direction === 'descending') await header.click();
  }

  async refresh(): Promise<void> {
    await this.page.getByRole('button', { name: 'refresh-button' }).click();
  }

  async openPageSizeSelector(): Promise<void> {
    await this.page.getByRole('button', { name: 'dropdown trigger' }).click();
  }

  async expectPageSize(value: string): Promise<void> {
    await expect(this.page.getByText(value, { exact: true })).toBeVisible();
  }

  async expectPaginationSummary(): Promise<void> {
    await expect(this.page.getByText(/showing \d+ to \d+ of \d+ entries/i)).toBeVisible();
  }

  async expectPageNumber(value: string): Promise<void> {
    await expect(this.page.getByRole('button', { name: value, exact: true })).toBeVisible();
  }
}
