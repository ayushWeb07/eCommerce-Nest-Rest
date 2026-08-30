export class SkuVo {
  private constructor(private readonly value: string) {}

  static create(value: string): SkuVo {
    return new SkuVo(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: SkuVo): boolean {
    return this.value === other.getValue();
  }
}
