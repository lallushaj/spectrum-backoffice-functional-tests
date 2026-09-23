import { ReferenceTablePage } from './ReferenceTablePage';

export class OrganizationTypesPage extends ReferenceTablePage {
  async waitUntilLoaded(): Promise<void> {
    await super.waitUntilLoaded('Organization Types');
  }
}
