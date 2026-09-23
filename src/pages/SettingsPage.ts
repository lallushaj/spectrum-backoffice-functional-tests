import { expect } from '@playwright/test';
import { Page } from './Page';

export class SettingsPage extends Page {
  private async expectAssociatedVisibleControl(label: string): Promise<void> {
    const labelLocator = this.page.getByText(label, { exact: true }).first();
    await expect(labelLocator).toBeVisible();

    const parentContainer = labelLocator.locator('xpath=ancestor::*[self::label or self::div or self::section or self::form or self::tr][1]');
    const preferredControl = parentContainer.locator('input, textarea, [role="textbox"], [role="combobox"], [role="switch"], button').first();

    if (await preferredControl.count()) {
      await expect(preferredControl).toBeVisible();
      return;
    }

    const fallbackControls = [
      labelLocator.locator('xpath=following::input[1]'),
      labelLocator.locator('xpath=following::textarea[1]'),
      labelLocator.locator('xpath=following::*[@role="textbox"][1]'),
      labelLocator.locator('xpath=following::*[@role="combobox"][1]'),
      labelLocator.locator('xpath=following::*[@role="switch"][1]'),
      labelLocator.locator('xpath=following::button[1]')
    ];

    let controlFound = false;
    for (const control of fallbackControls) {
      if (await control.count()) {
        await expect(control).toBeVisible();
        controlFound = true;
        break;
      }
    }

    if (!controlFound) {
      throw new Error(`No visible form control found for label: ${label}`);
    }
  }

  async expectSystemTimezoneConfiguration(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'System Setting', exact: true })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'System Timezone', exact: true })).toBeVisible();
    await expect(this.page.getByPlaceholder('Select a timezone')).toBeVisible();
    await expect(this.page.getByText('Save', { exact: true })).toBeDisabled();
  }

  async expectSystemTimezoneSelectorEnabledBeforeChange(): Promise<void> {
    const timezoneSelector = this.page.getByPlaceholder('Select a timezone');
    await expect(timezoneSelector).toBeVisible();
    await expect(timezoneSelector).toBeEnabled();
    await expect(this.page.getByText('Save', { exact: true })).toBeDisabled();
  }

  async expectGeneralPortalConfiguration(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'General settings', exact: true })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Portal status override', exact: true })).toBeVisible();
    await expect(this.page.getByRole('switch', { name: 'label activeOverride' })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Opening periods', exact: true })).toBeVisible();
    await expect(this.page.getByText('Normal application', { exact: true })).toBeVisible();
    await expect(this.page.getByText('Late application', { exact: true })).toBeVisible();
    await expect(this.page.getByText('Games time application', { exact: true })).toBeVisible();
  }

  async expectGeneralPortalStatusAndControls(): Promise<void> {
    const overrideSwitch = this.page.getByRole('switch', { name: 'label activeOverride' });
    await expect(this.page.getByRole('heading', { name: 'Portal status override', exact: true })).toBeVisible();
    await expect(overrideSwitch).toBeVisible();
    await expect(overrideSwitch).toBeEnabled();

    await expect(this.page.getByRole('heading', { name: 'Opening periods', exact: true })).toBeVisible();
    for (const label of ['Normal application', 'Late application', 'Games time application']) {
      await expect(this.page.getByText(label, { exact: true })).toBeVisible();
      await this.expectAssociatedVisibleControl(label);
    }
  }

  async expectCommunicationConfiguration(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Communication Settings', exact: true })).toBeVisible();
    await expect(this.page.getByText('Automatic email sender address', { exact: true })).toBeVisible();
    await expect(this.page.getByText('Automatic email sender name', { exact: true })).toBeVisible();
    await expect(this.page.getByText('Assistance email address', { exact: true })).toBeVisible();
    await expect(this.page.getByText('Email for BO notifications', { exact: true })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Trigger Event Name', exact: true })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Trigger Active for BO', exact: true })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: 'Trigger Active for FO', exact: true })).toBeVisible();
  }

  async expectCommunicationEmailTriggerTableAndControls(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Communication Settings', exact: true })).toBeVisible();

    const triggerTable = this.page.locator('table').filter({
      has: this.page.getByRole('columnheader', { name: 'Trigger Event Name', exact: true })
    }).first();

    await expect(triggerTable).toBeVisible();
    await expect(triggerTable.getByRole('columnheader', { name: 'Trigger Event Name', exact: true })).toBeVisible();
    await expect(triggerTable.getByRole('columnheader', { name: 'Trigger Active for BO', exact: true })).toBeVisible();
    await expect(triggerTable.getByRole('columnheader', { name: 'Trigger Active for FO', exact: true })).toBeVisible();
    const bodyRow = triggerTable.locator('tbody tr').first();
    await expect(bodyRow).toBeVisible();

    for (const label of [
      'Automatic email sender address',
      'Automatic email sender name',
      'Assistance email address',
      'Email for BO notifications'
    ]) {
      await this.expectAssociatedVisibleControl(label);
    }
  }

  async expectCommandOptions(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Commands', exact: true }).first()).toBeVisible();
    await expect(this.page.getByText('Administrative Commands to Manage the System', { exact: true })).toBeVisible();
    await this.page.getByRole('button', { name: 'dropdown trigger' }).click();
    for (const option of [
      'Sync Organisations',
      'Reporting - Sync Org Requests',
      'Sync Venues Seeder Strapi',
      'Sync Disciplines Shared Entities',
      'Sync License Periods Strapi'
    ]) {
      await expect(this.page.getByRole('option', { name: option, exact: true })).toBeVisible();
    }
  }

  async expectCommandDropdownWithoutExecuting(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Commands', exact: true }).first()).toBeVisible();
    const trigger = this.page.getByRole('button', { name: 'dropdown trigger' });
    await trigger.click();

    for (const option of [
      'Sync Organisations',
      'Reporting - Sync Org Requests',
      'Sync Venues Seeder Strapi',
      'Sync Disciplines Shared Entities',
      'Sync License Periods Strapi'
    ]) {
      await expect(this.page.getByRole('option', { name: option, exact: true })).toBeVisible();
    }

    const dialogs = this.page.getByRole('dialog').or(this.page.getByRole('alertdialog'));
    const dialogVisible = await dialogs.first().isVisible().catch(() => false);
    expect(dialogVisible).toBeFalsy();
  }

  async expectVenueCoordinateConfiguration(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Venues Settings', exact: true })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Coordinates validation', exact: true })).toBeVisible();
    for (const label of [
      'Min Latitude (NAD83)',
      'Max Latitude (NAD83)',
      'Min Longitude (NAD83)',
      'Max Longitude (NAD83)'
    ]) {
      await expect(this.page.getByText(label, { exact: true })).toBeVisible();
    }
    await expect(this.page.getByText(/standard global ranges are latitude -90 to 90/i)).toBeVisible();
  }

  async expectVenueCoordinateInputsAndGuidance(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: 'Venues Settings', exact: true })).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Coordinates validation', exact: true })).toBeVisible();

    for (const label of [
      'Min Latitude (NAD83)',
      'Max Latitude (NAD83)',
      'Min Longitude (NAD83)',
      'Max Longitude (NAD83)'
    ]) {
      await this.expectAssociatedVisibleControl(label);
    }

    await expect(this.page.getByText(/standard global ranges are latitude -90 to 90/i)).toBeVisible();
  }
}
