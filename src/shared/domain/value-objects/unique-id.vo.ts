export class UniqueIdVo {
  private readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UniqueIdVo): boolean {
    return this.value === other.getValue();
  }
}
