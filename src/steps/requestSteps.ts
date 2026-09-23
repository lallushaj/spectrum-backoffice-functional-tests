import { Given, Then, When } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/customWorld';
import { RequestsPage } from '../pages/RequestsPage';
import { expectNotification } from '../utils/assertions';

Given('the requests list is loaded', async function (this: CustomWorld) {
  await new RequestsPage(this.page).waitUntilLoaded();
});

When('the user selects the {string} request view', async function (this: CustomWorld, view: 'All Requests' | 'Cancelled Requests') {
  await new RequestsPage(this.page).selectView(view);
});

When('the user sorts requests by {string} {word}', async function (this: CustomWorld, column: string, direction: 'ascending' | 'descending') {
  await new RequestsPage(this.page).sortBy(column, direction);
});

When('the user opens request filters', async function (this: CustomWorld) {
  await new RequestsPage(this.page).openFilters();
});

When('the user cancels request filters', async function (this: CustomWorld) {
  await new RequestsPage(this.page).cancelFilters();
});

When('the user confirms request filters', async function (this: CustomWorld) {
  await new RequestsPage(this.page).confirmFilters();
});

When('the user searches requests for {string}', async function (this: CustomWorld, value: string) {
  await new RequestsPage(this.page).search(value);
});

When('the user clears the request search', async function (this: CustomWorld) {
  await new RequestsPage(this.page).clearSearch();
});

When('the user opens the first request result', async function (this: CustomWorld) {
  await new RequestsPage(this.page).openFirstRequest();
});

When('the user changes the request status to {string}', async function (this: CustomWorld, status: 'APPROVED' | 'REJECTED' | 'CANCELLED') {
  await new RequestsPage(this.page).setStatus(status);
});

Then('the request results should contain {string}', async function (this: CustomWorld, value: string) {
  await new RequestsPage(this.page).expectRequest(value);
});

Then('the request table should display all business columns', async function (this: CustomWorld) {
  await new RequestsPage(this.page).expectColumns();
});

Then('the request results should show no data', async function (this: CustomWorld) {
  await expect(this.page.getByText('No data available.', { exact: true })).toBeVisible();
});

Then('the request list should show status {string}', async function (this: CustomWorld, status: 'Created' | 'Cancelled') {
  await new RequestsPage(this.page).expectStatus(status);
});

Then('the request filters should include service status venue and organization', async function (this: CustomWorld) {
  await new RequestsPage(this.page).expectFilterFields();
});

Then('the request pagination summary should be displayed', async function (this: CustomWorld) {
  await new RequestsPage(this.page).expectPaginationSummary();
});

Then('the request page size should show {string}', async function (this: CustomWorld, value: string) {
  await new RequestsPage(this.page).expectPageSize(value);
});

Then('the request list should expose page number {string}', async function (this: CustomWorld, value: string) {
  await new RequestsPage(this.page).expectPageNumber(value);
});

Then('the request toolbar actions should be available', async function (this: CustomWorld) {
  await new RequestsPage(this.page).expectToolbarActions();
});

Then('the request details should be displayed', async function (this: CustomWorld) {
  await new RequestsPage(this.page).expectRequestDetails();
});

Then('the request status action should be disabled', async function (this: CustomWorld) {
  await new RequestsPage(this.page).expectStatusActionDisabled();
});

Then('the request status change should be confirmed', async function (this: CustomWorld) {
  await expectNotification(this.page);
});
