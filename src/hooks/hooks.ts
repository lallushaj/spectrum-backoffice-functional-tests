import { After, Before, BeforeAll, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import { environment } from '../config/environment';
import { EntitlementsPage } from '../pages/EntitlementsPage';
import { LoginPage } from '../pages/LoginPage';
import { SpectrumBackOfficePage } from '../pages/SpectrumBackOfficePage';
import type { CustomWorld } from '../support/customWorld';

setDefaultTimeout(120000);

async function cleanup(action: (() => Promise<void>) | undefined): Promise<void> {
  if (!action) return;
  await Promise.race([
    action().catch(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, 10000))
  ]);
}

async function wait(ms: number): Promise<void> {
  if (ms <= 0) return;
  await new Promise((resolve) => setTimeout(resolve, ms));
}

BeforeAll(async function () {
  // Configuration is loaded by importing environment; browser instances remain scenario-scoped.
  if (!environment.url || !environment.username) throw new Error('Spectrum environment is incomplete');
});

Before({ tags: '@spectrum' }, async function (this: CustomWorld) {
  this.scenario.browser = await chromium.launch({ headless: !environment.headed, slowMo: environment.slowMo });
  this.scenario.browserContext = await this.scenario.browser.newContext();
  this.scenario.page = await this.scenario.browserContext.newPage();

  const login = new LoginPage(this.page);
  await login.open();
  await login.login();
  const entitlements = new EntitlementsPage(this.page);
  await entitlements.waitUntilLoaded();
  this.scenario.page = await entitlements.switchApp();
  const spectrum = new SpectrumBackOfficePage(this.page);
  await spectrum.waitUntilLoaded();
});

After(async function (this: CustomWorld, scenario) {
  if (scenario.result?.status === Status.FAILED && this.scenario.page) {
    await this.attach(await this.scenario.page.screenshot({ fullPage: true }), 'image/png');
  }
  if (environment.keepBrowserOpenMs > 0) {
    await wait(environment.keepBrowserOpenMs);
  }
  await cleanup(this.scenario.browserContext ? () => this.scenario.browserContext!.close() : undefined);
  await cleanup(this.scenario.browser ? () => this.scenario.browser!.close() : undefined);
});
