import type { Browser, BrowserContext, Page } from 'playwright';

export class ScenarioContext {
  browser?: Browser;
  browserContext?: BrowserContext;
  page?: Page;
  readonly values = new Map<string, string>();

  set(key: string, value: string): void {
    this.values.set(key, value);
  }

  get(key: string): string {
    const value = this.values.get(key);
    if (!value) {
      throw new Error(`Scenario value has not been set: ${key}`);
    }
    return value;
  }
}
