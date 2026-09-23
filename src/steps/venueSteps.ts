import { Given, Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/customWorld';
import { VenuesPage } from '../pages/VenuesPage';
import { TestDataFactory } from '../utils/TestDataFactory';
import { expectValidation, expectNotification } from '../utils/assertions';

Given('the venues list is loaded', async function (this: CustomWorld) {
  await new VenuesPage(this.page).waitUntilLoaded();
});

When('the user searches venues for {string}', async function (this: CustomWorld, value: string) {
  await new VenuesPage(this.page).search(value);
});

When('the user clears the venue search', async function (this: CustomWorld) {
  await new VenuesPage(this.page).clearSearch();
});

When('the user sorts venues by {string} {word}', async function (this: CustomWorld, column: string, direction: 'ascending' | 'descending') {
  await new VenuesPage(this.page).sortBy(column, direction);
});

When('the user refreshes the venues table', async function (this: CustomWorld) {
  await new VenuesPage(this.page).refresh();
});

When('the user selects venue type {string}', async function (this: CustomWorld, type: 'Indoor' | 'Outdoor') {
  await new VenuesPage(this.page).selectVenueType(type);
});

When('the user opens the venue type selector', async function (this: CustomWorld) {
  await new VenuesPage(this.page).openVenueTypeSelector();
});

When('the user fills venue name {string} and code {string}', async function (this: CustomWorld, name: string, code: string) {
  await new VenuesPage(this.page).fillVenue(name, code);
});

When('the user validates venue address {string}', async function (this: CustomWorld, address: string) {
  await new VenuesPage(this.page).validateAddress(address);
});

When('the user enters venue address {string}', async function (this: CustomWorld, address: string) {
  await new VenuesPage(this.page).enterAddress(address);
});

When('the user enters venue coordinates {string} and {string}', async function (this: CustomWorld, latitude: string, longitude: string) {
  await new VenuesPage(this.page).fillCoordinates(latitude, longitude);
});

When('the user cancels venue creation', async function (this: CustomWorld) {
  await new VenuesPage(this.page).cancelCreate();
});

When('the user saves venue creation', async function (this: CustomWorld) {
  await new VenuesPage(this.page).saveCreate();
});

When('the user confirms the venue creation dialog', async function (this: CustomWorld) {
  await new VenuesPage(this.page).confirmCreateDialog();
});

Given('the user opens the venue creation form', async function (this: CustomWorld) {
  await new VenuesPage(this.page).openCreate();
});

When('the user creates a valid unique venue', async function (this: CustomWorld) {
  const name = TestDataFactory.uniqueName('venue');
  const code = TestDataFactory.uniqueCode();
  this.scenario.set('venueName', name);
  this.scenario.set('venueCode', code);
  const venues = new VenuesPage(this.page);
  await venues.fillVenue(name, code);
  await venues.validateAddress('10 Downing Street, London');
  await venues.save();
});

When('the user attempts to save the venue without a validated address', async function (this: CustomWorld) {
  const venues = new VenuesPage(this.page);
  await venues.fillVenue(TestDataFactory.uniqueName('invalidVenue'), TestDataFactory.uniqueCode());
});

Then('the venue should be saved successfully', async function (this: CustomWorld) {
  await expectNotification(this.page);
});

Then('the created venue should be searchable', async function (this: CustomWorld) {
  const venues = new VenuesPage(this.page);
  await venues.search(this.scenario.get('venueName'));
  await venues.expectVenue(this.scenario.get('venueName'));
});

Then('the venue form should show validation feedback', async function (this: CustomWorld) {
  await expectValidation(this.page);
});

Then('the venue table should show its business columns', async function (this: CustomWorld) {
  await new VenuesPage(this.page).expectColumns();
});

Then('the venue results should show no data', async function (this: CustomWorld) {
  await new VenuesPage(this.page).expectNoData();
});

Then('the venue pagination summary should be displayed', async function (this: CustomWorld) {
  await new VenuesPage(this.page).expectPaginationSummary();
});

Then('the venue page size should show {string}', async function (this: CustomWorld, value: string) {
  await new VenuesPage(this.page).expectPageSize(value);
});

Then('the venue results should contain {string}', async function (this: CustomWorld, value: string) {
  await new VenuesPage(this.page).expectVenue(value);
});

Then('the venue list should expose page number {string}', async function (this: CustomWorld, value: string) {
  await new VenuesPage(this.page).expectPageNumber(value);
});

Then('the venue creation fields should be displayed', async function (this: CustomWorld) {
  await new VenuesPage(this.page).expectCreateFields();
});

Then('the venue address validation control should be disabled', async function (this: CustomWorld) {
  await new VenuesPage(this.page).expectValidateDisabled();
});

Then('the venue address validation control should be enabled', async function (this: CustomWorld) {
  await new VenuesPage(this.page).expectValidateEnabled();
});

Then('the venue address should be marked as not validated', async function (this: CustomWorld) {
  await new VenuesPage(this.page).expectAddressNotValidated();
});

Then('the venue save button should be disabled', async function (this: CustomWorld) {
  await new VenuesPage(this.page).expectSaveDisabled();
});

Then('the venue save button should be enabled', async function (this: CustomWorld) {
  await new VenuesPage(this.page).expectSaveEnabled();
});

Then('the venue type options should be available', async function (this: CustomWorld) {
  await new VenuesPage(this.page).expectVenueTypeOptions();
});

Then('venue type {string} should be selected', async function (this: CustomWorld, type: 'Indoor' | 'Outdoor') {
  await new VenuesPage(this.page).expectVenueTypeSelected(type);
});

Then('the venue coordinates should remain {string} and {string}', async function (this: CustomWorld, latitude: string, longitude: string) {
  await new VenuesPage(this.page).expectCoordinates(latitude, longitude);
});
