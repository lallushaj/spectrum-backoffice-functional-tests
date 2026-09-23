import { expect } from '@playwright/test';
import { Page } from './Page';

export class RequestsPage extends Page {
  private readonly searchInput = this.page.getByPlaceholder('Search...').first();

  async waitUntilLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: /requests/i })).toBeVisible();
    await expect(this.page.getByRole('tab', { name: 'All Requests', exact: true })).toBeVisible();
    await expect(this.searchInput).toBeVisible();
  }

  async selectView(view: 'All Requests' | 'Cancelled Requests'): Promise<void> {
    await this.page.getByRole('tab', { name: view, exact: true }).click();
  }

  async expectColumns(): Promise<void> {
    for (const column of [
      'Select',
      'Request ID',
      'Status',
      'Date',
      'User',
      'Organization',
      'Service',
      'License period',
      'Period and Venue',
      'Venue',
      'Device Name - Equipment Model'
    ]) {
      await expect(this.page.getByRole('columnheader', { name: column, exact: true })).toBeVisible();
    }
  }

  async expectStatus(status: 'Created' | 'Cancelled'): Promise<void> {
    await expect(this.page.getByText(status, { exact: true }).first()).toBeVisible();
  }

  async search(value: string): Promise<void> {
    const searchButton = this.page.getByRole('button', { name: /activate search/i });
    if (await searchButton.isVisible().catch(() => false)) await searchButton.click();
    await this.searchInput.fill(value);
    await this.searchInput.press('Enter');
  }

  async clearSearch(): Promise<void> {
    await this.searchInput.fill('');
    await this.searchInput.press('Enter');
  }

  async sortBy(column: string, direction: 'ascending' | 'descending'): Promise<void> {
    const header = this.page.getByRole('columnheader', { name: column, exact: true });
    await header.click();
    if (direction === 'descending') await header.click();
  }

  async openFilters(): Promise<void> {
    const filters = this.page.getByRole('heading', { name: 'Filters', exact: true });
    if (!(await filters.isVisible().catch(() => false))) {
      await this.page.getByRole('button', { name: 'Filter', exact: true }).click();
    }
  }

  async expectFilterFields(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Filters', exact: true })).toBeVisible();
    for (const field of ['Spectrum service', 'Status', 'Venue', 'Organization']) {
      await expect(this.page.getByText(field, { exact: true }).first()).toBeVisible();
    }
  }

  async cancelFilters(): Promise<void> {
    await this.page.getByRole('button', { name: 'Cancel', exact: true }).click();
  }

  async confirmFilters(): Promise<void> {
    await this.page.getByRole('button', { name: 'Confirm', exact: true }).click();
  }

  async expectPaginationSummary(): Promise<void> {
    await expect(this.page.getByText(/showing \d+ to \d+ of \d+ entries/i)).toBeVisible();
  }

  async expectPageSize(value: string): Promise<void> {
    await expect(this.page.getByText(value, { exact: true })).toBeVisible();
  }

  async expectPageNumber(value: string): Promise<void> {
    await expect(this.page.getByRole('button', { name: value, exact: true })).toBeVisible();
  }

  async expectToolbarActions(): Promise<void> {
    await expect(this.page.getByRole('button', { name: 'Scan QR Code', exact: true })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Import', exact: true })).toBeVisible();
    await expect(this.page.getByText('Bulk Actions', { exact: true })).toBeVisible();
  }

  async openFirstRequest(): Promise<void> {
    await this.page.locator('td a').first().click();
  }

  async expectRequestDetails(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: /Request -/i })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Set Status', exact: true })).toBeVisible();
  }

  async expectStatusActionDisabled(): Promise<void> {
    await expect(this.page.getByRole('button', { name: 'Set Status', exact: true })).toBeDisabled();
  }

  async setStatus(status: 'APPROVED' | 'REJECTED' | 'CANCELLED'): Promise<void> {
    await this.page.getByRole('button', { name: /set status/i }).click();
    await this.page.getByRole('menuitem', { name: new RegExp(status, 'i') }).click();
  }

  async expectRequest(name: string): Promise<void> {
    await expect(this.page.getByText(name, { exact: false })).toBeVisible();
  }
}
