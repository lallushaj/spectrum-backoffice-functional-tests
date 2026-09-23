import { Given, Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/customWorld';
import { DisciplinesPage } from '../pages/DisciplinesPage';
import { OrganizationTypesPage } from '../pages/OrganizationTypesPage';
import { OrganizationsPage } from '../pages/OrganizationsPage';
import { ReferenceTablePage } from '../pages/ReferenceTablePage';

type EntityModule = 'Disciplines' | 'Organizations' | 'Organizations Types';

function pageFor(world: CustomWorld, module: EntityModule): ReferenceTablePage {
  if (module === 'Disciplines') return new DisciplinesPage(world.page);
  if (module === 'Organizations') return new OrganizationsPage(world.page);
  return new OrganizationTypesPage(world.page);
}

Given('the {string} reference table is loaded', async function (this: CustomWorld, module: EntityModule) {
  const title = module === 'Organizations Types' ? 'Organization Types' : module;
  await pageFor(this, module).waitUntilLoaded(title);
});

When('the user searches the {string} table for {string}', async function (this: CustomWorld, module: EntityModule, value: string) {
  await pageFor(this, module).search(value);
});

When('the user clears the {string} table search', async function (this: CustomWorld, module: EntityModule) {
  await pageFor(this, module).clearSearch();
});

When('the user sorts the {string} table by {string} {word}', async function (this: CustomWorld, module: EntityModule, column: string, direction: 'ascending' | 'descending') {
  await pageFor(this, module).sortBy(column, direction);
});

When('the user refreshes the {string} table', async function (this: CustomWorld, module: EntityModule) {
  await pageFor(this, module).refresh();
});

When('the user opens the {string} table page-size selector', async function (this: CustomWorld, module: EntityModule) {
  await pageFor(this, module).openPageSizeSelector();
});

Then('the {string} table should show columns {string}', async function (this: CustomWorld, module: EntityModule, columns: string) {
  await pageFor(this, module).expectColumns(columns.split(',').map((column) => column.trim()));
});

Then('the {string} table should show no data', async function (this: CustomWorld, module: EntityModule) {
  await pageFor(this, module).expectNoData();
});

Then('the {string} table should contain {string}', async function (this: CustomWorld, module: EntityModule, value: string) {
  await pageFor(this, module).expectResult(value);
});

Then('the {string} table page size should show {string}', async function (this: CustomWorld, module: EntityModule, value: string) {
  await pageFor(this, module).expectPageSize(value);
});

Then('the {string} table pagination summary should be displayed', async function (this: CustomWorld, module: EntityModule) {
  await pageFor(this, module).expectPaginationSummary();
});

Then('the {string} table should expose page number {string}', async function (this: CustomWorld, module: EntityModule, value: string) {
  await pageFor(this, module).expectPageNumber(value);
});
