import { Given, Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/customWorld';
import { ReportsPage } from '../pages/ReportsPage';

Given('the embedded reports table is loaded', async function (this: CustomWorld) {
  await new ReportsPage(this.page).waitUntilLoaded();
});

When('the user searches reports for {string}', async function (this: CustomWorld, value: string) {
  await new ReportsPage(this.page).search(value);
});

When('the user clears the report search', async function (this: CustomWorld) {
  await new ReportsPage(this.page).clearSearch();
});

When('the user sorts reports by {string} {word}', async function (this: CustomWorld, column: 'Title' | 'Created' | 'Updated', direction: 'ascending' | 'descending') {
  await new ReportsPage(this.page).sortBy(column, direction);
});

When('the user refreshes the reports table', async function (this: CustomWorld) {
  await new ReportsPage(this.page).refresh();
});

Then('the embedded reports table should be displayed', async function (this: CustomWorld) {
  await new ReportsPage(this.page).expectEmbeddedTable();
});

Then('the reports table should show its supported columns', async function (this: CustomWorld) {
  await new ReportsPage(this.page).expectColumns();
});

Then('the reports search controls should be displayed', async function (this: CustomWorld) {
  await new ReportsPage(this.page).expectSearchControl();
});

Then('the reports table should show no data', async function (this: CustomWorld) {
  await new ReportsPage(this.page).expectNoData();
});
