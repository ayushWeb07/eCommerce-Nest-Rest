export class MoneyVo {
  private constructor(
    private readonly amount: number,
    private readonly currency: string,
  ) {}

  static create(amount: number, currency: string = 'USD'): MoneyVo {
    if (amount < 0) {
      throw new Error(`Invalid money amount has been provided`);
    }

    // create the money vo
    return new MoneyVo(amount, currency.toUpperCase());
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }
}
