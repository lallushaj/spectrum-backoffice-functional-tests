import { expect } from '@playwright/test';
import { Page } from './Page';

export class AppointmentsPage extends Page {
  private readonly searchInput = this.page.getByRole('textbox', { name: 'Search...' });

  async waitUntilLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Appointments', exact: true })).toBeVisible();
    await expect(this.searchInput).toBeVisible();
  }

  async expectListColumns(columns: string[]): Promise<void> {
    for (const column of columns) {
      await expect(this.page.getByRole('columnheader', { name: column, exact: true })).toBeVisible();
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
    await expect(this.page.getByText('No data available.', { exact: true })).toBeVisible();
  }

  async sortBy(column: string, direction: 'ascending' | 'descending'): Promise<void> {
    const header = this.page.getByRole('columnheader', { name: column, exact: true });
    await header.click();
    if (direction === 'descending') await header.click();
  }

  async openColumnSelector(): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Select Columns' }).click();
  }

  async expectColumnSelectorCount(count: string): Promise<void> {
    await expect(this.page.getByText(count, { exact: true })).toBeVisible();
  }

  async expectPageSize(value: string): Promise<void> {
    await expect(this.page.getByText(value, { exact: true })).toBeVisible();
  }

  async expectPaginationSummary(): Promise<void> {
    await expect(this.page.getByText(/showing \d+ to \d+ of \d+ entries/i)).toBeVisible();
  }

  async openPageSizeSelector(): Promise<void> {
    await this.page.getByRole('button', { name: 'dropdown trigger' }).click();
  }

  async openFilters(): Promise<void> {
    await this.page.getByText('Filter', { exact: true }).click();
  }

  async expectAppointmentFilters(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Filters', exact: true })).toBeVisible();
    await expect(this.page.getByText('Spectrum service', { exact: true })).toBeVisible();
    await expect(this.page.getByText('Venue', { exact: true })).toBeVisible();
  }

  async cancelFilters(): Promise<void> {
    await this.page.getByRole('button', { name: /cancel/i }).click();
  }

  async confirmFilters(): Promise<void> {
    await this.page.getByText('Confirm', { exact: true }).click();
  }

  async closeFilters(): Promise<void> {
    await this.page.getByText('Close', { exact: true }).click();
  }

  async expectFiltersClosed(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Filters', exact: true })).toBeHidden();
    await expect(this.searchInput).toBeVisible();
  }

  async openCreate(): Promise<void> {
    await this.page.getByText('New Appointment', { exact: true }).click();
  }

  async expectOrganizationStep(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'New Appointment', exact: true })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Select organization', exact: true })).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'Type to search...' })).toBeVisible();
  }

  async openOrganizationOptions(): Promise<void> {
    await this.page.getByRole('button', { name: 'Toggle dropdown' }).click();
  }

  async expectOrganizationOptions(): Promise<void> {
    await expect(this.page.getByRole('listbox')).toBeVisible();
    await expect(this.page.getByRole('option').first()).toBeVisible();
  }

  async selectFirstOrganization(): Promise<void> {
    await this.page.getByRole('option').first().click();
  }

  async searchOrganization(term: string): Promise<void> {
    await this.page.getByRole('textbox', { name: 'Type to search...' }).fill(term);
  }

  async expectOrganizationSearchValue(value: string): Promise<void> {
    await expect(this.page.getByRole('textbox', { name: 'Type to search...' })).toHaveValue(value);
  }

  async cancelCreate(): Promise<void> {
    await this.page.getByText('Cancel', { exact: true }).click();
  }

  async expectRequestsStep(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Requests', exact: true })).toBeVisible();
    await expect(this.page.getByRole('textbox', { name: 'Search...' })).toBeVisible();
  }

  async expectSngSelectionRule(): Promise<void> {
    await expect(this.page.getByText(/select sng requests separately/i)).toBeVisible();
    await expect(this.page.getByText(/mixing sng requests with other types isn't allowed/i)).toBeVisible();
  }

  async expectVenueAndDateDisabled(): Promise<void> {
    await expect(this.page.locator('button').filter({ hasText: 'Venue and Date' })).toBeDisabled();
  }
}
