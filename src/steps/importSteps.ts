import { Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/customWorld';
import { BulkImportPage } from '../pages/BulkImportPage';

When('the user opens the first request import process', async function (this: CustomWorld) {
  await new BulkImportPage(this.page).openFirstImportProcess();
});

Then('the request import list should be displayed', async function (this: CustomWorld) {
  await new BulkImportPage(this.page).expectImportList();
});

Then('the request import details should be displayed', async function (this: CustomWorld) {
  await new BulkImportPage(this.page).expectImportDetails();
});
