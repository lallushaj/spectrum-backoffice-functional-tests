export class TestDataFactory {
  private static readonly suffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  static uniqueName(entity: string): string {
    return `AQA_${entity}_${this.suffix}`;
  }

  static uniqueCode(): string {
    return `A${String(Date.now()).slice(-2)}${Math.floor(Math.random() * 10)}`;
  }

  static email(prefix = 'spectrum.aqa'): string {
    return `${prefix}.${this.suffix}@example.test`;
  }

  static phone(): string {
    return `+346${String(Date.now()).slice(-8)}`;
  }
}
