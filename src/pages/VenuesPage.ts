import { expect, type Dialog } from '@playwright/test';
import { Page } from './Page';

export class VenuesPage extends Page {
  async waitUntilLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Venues', exact: true })).toBeVisible({ timeout: 30000 });
    await expect(this.page.getByText('Create Venue', { exact: true })).toBeVisible({ timeout: 30000 });
  }

  async expectColumns(): Promise<void> {
    for (const column of ['Venue', 'Address', 'Location', 'Code']) {
      await expect(this.page.getByRole('columnheader', { name: column, exact: true })).toBeVisible();
    }
  }

  async openCreate(): Promise<void> {
    await this.page.getByText('Create Venue', { exact: true }).click();
  }

  async fillVenue(name: string, code: string): Promise<void> {
    await this.page.getByPlaceholder('Venue Name').fill(name);
    await this.page.getByPlaceholder('E.g. VNU').fill(code);
  }

  async validateAddress(address: string): Promise<void> {
    await this.page.getByPlaceholder('Address to validate').fill(address);
    await this.page.getByText('Validate', { exact: true }).click();
  }

  async enterAddress(address: string): Promise<void> {
    await this.page.getByPlaceholder('Address to validate').fill(address);
  }

  async fillCoordinates(latitude: string, longitude: string): Promise<void> {
    await this.page.getByPlaceholder('Insert latitude').fill(latitude);
    const longitudeInput = this.page.getByPlaceholder('Insert longitude');
    await longitudeInput.fill(longitude);
    await longitudeInput.press('Tab');
  }

  async save(): Promise<void> {
    await this.page.getByText('Save', { exact: true }).click();
  }

  async search(name: string): Promise<void> {
    const button = this.page.getByRole('button', { name: /activate search/i });
    if (await button.isVisible().catch(() => false)) await button.click();
    await this.page.getByPlaceholder('Search...').fill(name);
    await this.page.getByPlaceholder('Search...').press('Enter');
  }

  async clearSearch(): Promise<void> {
    const search = this.page.getByPlaceholder('Search...');
    await search.fill('');
    await search.press('Enter');
  }

  async sortBy(column: string, direction: 'ascending' | 'descending'): Promise<void> {
    const header = this.page.getByRole('columnheader', { name: column, exact: true });
    await header.click();
    if (direction === 'descending') await header.click();
  }

  async refresh(): Promise<void> {
    await this.page.getByRole('button', { name: 'refresh-button' }).click();
  }

  async expectNoData(): Promise<void> {
    await expect(this.page.getByText('No data available.', { exact: true })).toBeVisible();
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

  async expectCreateFields(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Create Venue', exact: true })).toBeVisible();
    await expect(this.page.getByPlaceholder('Venue Name')).toBeVisible();
    await expect(this.page.getByPlaceholder('E.g. VNU')).toBeVisible();
    await expect(this.page.getByPlaceholder('Address to validate')).toBeVisible();
    await expect(this.page.getByPlaceholder('Insert latitude')).toBeVisible();
    await expect(this.page.getByPlaceholder('Insert longitude')).toBeVisible();
    await expect(this.page.getByRole('combobox', { name: 'Select element 1' })).toBeVisible();
  }

  async expectValidateDisabled(): Promise<void> {
    await expect(this.page.getByText('Validate', { exact: true })).toBeDisabled();
  }

  async expectValidateEnabled(): Promise<void> {
    await expect(this.page.getByText('Validate', { exact: true })).toBeEnabled();
  }

  async expectAddressNotValidated(): Promise<void> {
    await expect(this.page.getByText('Address not validated', { exact: true })).toBeVisible();
  }

  async expectVenueTypeOptions(): Promise<void> {
    await expect(this.page.getByRole('option', { name: 'Indoor', exact: true })).toBeVisible();
    await expect(this.page.getByRole('option', { name: 'Outdoor', exact: true })).toBeVisible();
  }

  async selectVenueType(type: 'Indoor' | 'Outdoor'): Promise<void> {
    await this.page.getByRole('button', { name: 'dropdown trigger' }).click();
    await this.page.getByRole('option', { name: type, exact: true }).click();
  }

  async openVenueTypeSelector(): Promise<void> {
    await this.page.getByRole('button', { name: 'dropdown trigger' }).click();
  }

  async expectVenueTypeSelected(type: 'Indoor' | 'Outdoor'): Promise<void> {
    await expect(this.page.getByText(type, { exact: true })).toBeVisible();
  }

  async expectCoordinates(latitude: string, longitude: string): Promise<void> {
    await expect(this.page.getByPlaceholder('Insert latitude')).toHaveValue(latitude);
    await expect(this.page.getByPlaceholder('Insert longitude')).toHaveValue(longitude);
  }

  async cancelCreate(): Promise<void> {
    await this.page.getByText('Cancel', { exact: true }).click();
  }

  async saveCreate(): Promise<void> {
    const saveButton = this.page.locator('ewc-regular-button').filter({ hasText: /^Save$/ }).locator('button');
    await expect(saveButton).toBeVisible({ timeout: 15000 });
    await expect(saveButton).toBeEnabled({ timeout: 15000 });

    let nativeDialogShown = false;
    const acceptNativeDialog = async (dialog: Dialog): Promise<void> => {
      nativeDialogShown = true;
      await dialog.accept();
    };

    this.page.once('dialog', acceptNativeDialog);
    try {
      await saveButton.click();
    } finally {
      this.page.removeListener('dialog', acceptNativeDialog);
    }

    if (nativeDialogShown) return;
  }

  async confirmCreateDialog(): Promise<void> {
    const popupFooter = this.page.locator('div.dialog-footer-buttons:visible').first();
    await expect(popupFooter).toBeVisible({ timeout: 15000 });

    const confirmButton = popupFooter.locator('ewc-regular-button').last().locator('button');
    await expect(confirmButton).toBeVisible({ timeout: 15000 });
    await confirmButton.click();

    await expect(popupFooter).toBeHidden({ timeout: 30000 });
    await expect(this.page.getByRole('heading', { name: 'Venues', exact: true })).toBeVisible({ timeout: 30000 });
  }

  async expectVenue(name: string): Promise<void> {
    await expect(this.page.getByText(name, { exact: false })).toBeVisible();
  }

  async expectSaveDisabled(): Promise<void> {
    await expect(this.page.locator('ewc-regular-button').filter({ hasText: /^Save$/ }).locator('button')).toBeDisabled();
  }

  async expectSaveEnabled(): Promise<void> {
    await expect(this.page.locator('ewc-regular-button').filter({ hasText: /^Save$/ }).locator('button')).toBeEnabled({ timeout: 15000 });
  }
}
