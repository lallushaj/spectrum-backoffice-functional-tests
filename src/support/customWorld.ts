import { World, setWorldConstructor, type IWorldOptions } from '@cucumber/cucumber';
import { ScenarioContext } from '../context/ScenarioContext';

export class CustomWorld extends World {
  readonly scenario = new ScenarioContext();

  constructor(options: IWorldOptions) {
    super(options);
  }

  get page() {
    if (!this.scenario.page) throw new Error('Playwright page is not available');
    return this.scenario.page;
  }
}

setWorldConstructor(CustomWorld);
