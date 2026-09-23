import { ReferenceTablePage } from './ReferenceTablePage';

export class OrganizationsPage extends ReferenceTablePage {
  async waitUntilLoaded(): Promise<void> {
    await super.waitUntilLoaded('Organizations');
  }
}
