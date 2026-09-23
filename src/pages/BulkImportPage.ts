import { expect } from '@playwright/test';
import { Page } from './Page';

export class BulkImportPage extends Page {
  async expectImportList(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Import List', exact: true })).toBeVisible();
    for (const column of ['Process ID', 'Status', 'Progress', 'User', 'Email', 'File Name', 'Imported']) {
      await expect(this.page.getByRole('columnheader', { name: column, exact: true })).toBeVisible();
    }
  }

  async openFirstImportProcess(): Promise<void> {
    await this.expectImportList();
    await this.page.locator('tbody tr a').first().click();
  }

  async expectImportDetails(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Bulk Details', exact: true })).toBeVisible();
    await expect(this.page.getByText(/import completed|import processing/i)).toBeVisible();
    await expect(this.page.getByText('Total record(s) for import', { exact: true })).toBeVisible();
    await expect(this.page.getByText('Successfully imported', { exact: true })).toBeVisible();
    await expect(this.page.getByText('Import File', { exact: true })).toBeVisible();
  }
}
