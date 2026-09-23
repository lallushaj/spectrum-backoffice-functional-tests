import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/customWorld';
import { SettingsPage } from '../pages/SettingsPage';

Then('the system timezone configuration should be available', async function (this: CustomWorld) {
  await new SettingsPage(this.page).expectSystemTimezoneConfiguration();
});

Then('the timezone selector is enabled while Save stays disabled before change', async function (this: CustomWorld) {
  await new SettingsPage(this.page).expectSystemTimezoneSelectorEnabledBeforeChange();
});

Then('the general portal configuration should be available', async function (this: CustomWorld) {
  await new SettingsPage(this.page).expectGeneralPortalConfiguration();
});

Then('the portal status override and opening periods display with form controls', async function (this: CustomWorld) {
  await new SettingsPage(this.page).expectGeneralPortalStatusAndControls();
});

Then('the communication configuration and email triggers should be available', async function (this: CustomWorld) {
  await new SettingsPage(this.page).expectCommunicationConfiguration();
});

Then('the communication email trigger table and sender controls are visible', async function (this: CustomWorld) {
  await new SettingsPage(this.page).expectCommunicationEmailTriggerTableAndControls();
});

Then('the administrative command options should be available', async function (this: CustomWorld) {
  await new SettingsPage(this.page).expectCommandOptions();
});

Then('the administrative command dropdown opens without triggering a dialog', async function (this: CustomWorld) {
  await new SettingsPage(this.page).expectCommandDropdownWithoutExecuting();
});

Then('the venue coordinate configuration should be available', async function (this: CustomWorld) {
  await new SettingsPage(this.page).expectVenueCoordinateConfiguration();
});

Then('the venue coordinate inputs and guidance are visible', async function (this: CustomWorld) {
  await new SettingsPage(this.page).expectVenueCoordinateInputsAndGuidance();
});
