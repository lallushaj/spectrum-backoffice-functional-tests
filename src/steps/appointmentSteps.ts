import { Given, Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/customWorld';
import { AppointmentsPage } from '../pages/AppointmentsPage';

Given('the appointments list is loaded', async function (this: CustomWorld) {
  await new AppointmentsPage(this.page).waitUntilLoaded();
});

When('the user searches appointments for {string}', async function (this: CustomWorld, value: string) {
  await new AppointmentsPage(this.page).search(value);
});

When('the user clears the appointment search', async function (this: CustomWorld) {
  await new AppointmentsPage(this.page).clearSearch();
});

When('the user sorts appointments by {string} {word}', async function (this: CustomWorld, column: string, direction: 'ascending' | 'descending') {
  await new AppointmentsPage(this.page).sortBy(column, direction);
});

When('the user opens the appointment column selector', async function (this: CustomWorld) {
  await new AppointmentsPage(this.page).openColumnSelector();
});

When('the user opens the appointment page-size selector', async function (this: CustomWorld) {
  await new AppointmentsPage(this.page).openPageSizeSelector();
});

When('the user opens appointment filters', async function (this: CustomWorld) {
  await new AppointmentsPage(this.page).openFilters();
});

When('the user cancels appointment filters', async function (this: CustomWorld) {
  await new AppointmentsPage(this.page).cancelFilters();
});

When('the user confirms appointment filters', async function (this: CustomWorld) {
  await new AppointmentsPage(this.page).confirmFilters();
});

When('the user closes appointment filters', async function (this: CustomWorld) {
  await new AppointmentsPage(this.page).closeFilters();
});

When('the user starts a new appointment', async function (this: CustomWorld) {
  await new AppointmentsPage(this.page).openCreate();
});

When('the user searches for organization {string}', async function (this: CustomWorld, term: string) {
  await new AppointmentsPage(this.page).searchOrganization(term);
});

When('the user cancels the new appointment', async function (this: CustomWorld) {
  await new AppointmentsPage(this.page).cancelCreate();
});

When('the user opens the organization options', async function (this: CustomWorld) {
  await new AppointmentsPage(this.page).openOrganizationOptions();
});

When('the user selects the first organization', async function (this: CustomWorld) {
  await new AppointmentsPage(this.page).selectFirstOrganization();
});

Then('the appointment list should show columns {string}', async function (this: CustomWorld, columns: string) {
  await new AppointmentsPage(this.page).expectListColumns(columns.split(',').map((column) => column.trim()));
});

Then('the appointment results should show no data', async function (this: CustomWorld) {
  await new AppointmentsPage(this.page).expectNoData();
});

Then('the appointment column selector should show {string} selected columns', async function (this: CustomWorld, count: string) {
  await new AppointmentsPage(this.page).expectColumnSelectorCount(count);
});

Then('the appointment page size should show {string}', async function (this: CustomWorld, value: string) {
  await new AppointmentsPage(this.page).expectPageSize(value);
});

Then('the appointment pagination summary should be displayed', async function (this: CustomWorld) {
  await new AppointmentsPage(this.page).expectPaginationSummary();
});

Then('the appointment filters should include service and venue', async function (this: CustomWorld) {
  await new AppointmentsPage(this.page).expectAppointmentFilters();
});

Then('the new appointment organization step should be displayed', async function (this: CustomWorld) {
  await new AppointmentsPage(this.page).expectOrganizationStep();
});

Then('organization options should be available', async function (this: CustomWorld) {
  await new AppointmentsPage(this.page).expectOrganizationOptions();
});

Then('the organization search field should contain {string}', async function (this: CustomWorld, value: string) {
  await new AppointmentsPage(this.page).expectOrganizationSearchValue(value);
});

Then('the appointment request step should be displayed', async function (this: CustomWorld) {
  await new AppointmentsPage(this.page).expectRequestsStep();
});

Then('the SNG request selection rule should be displayed', async function (this: CustomWorld) {
  await new AppointmentsPage(this.page).expectSngSelectionRule();
});

Then('the Venue and Date action should be disabled', async function (this: CustomWorld) {
  await new AppointmentsPage(this.page).expectVenueAndDateDisabled();
});

Then('the appointment filters should be closed and the list should remain visible', async function (this: CustomWorld) {
  await new AppointmentsPage(this.page).expectFiltersClosed();
});

Then('the appointment list should be displayed again', async function (this: CustomWorld) {
  await new AppointmentsPage(this.page).waitUntilLoaded();
});
