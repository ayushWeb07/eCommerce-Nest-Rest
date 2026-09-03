export class EmailVo {
  private constructor(private readonly value: string) {}

  static create(value: string): EmailVo {
    return new EmailVo(value);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: EmailVo): boolean {
    return this.value === other.getValue();
  }
}
