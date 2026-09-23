import { Given, When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/customWorld';
import { SpectrumBackOfficePage } from '../pages/SpectrumBackOfficePage';

Given('the user is logged into Spectrum Back Office', async function (this: CustomWorld) {
  await new SpectrumBackOfficePage(this.page).waitUntilLoaded();
});

When('the user opens the {string} module', async function (this: CustomWorld, module: 'Requests' | 'Appointments' | 'Entities' | 'Venues' | 'Import' | 'Reports' | 'Disciplines' | 'Organizations' | 'Organizations Types' | 'System Settings' | 'General Settings' | 'Communication Settings' | 'Commands' | 'Venue Settings') {
  await new SpectrumBackOfficePage(this.page).openModule(module);
});
