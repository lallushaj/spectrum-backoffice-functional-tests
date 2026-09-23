import { ReferenceTablePage } from './ReferenceTablePage';

export class DisciplinesPage extends ReferenceTablePage {
  async waitUntilLoaded(): Promise<void> {
    await super.waitUntilLoaded('Disciplines');
  }
}
