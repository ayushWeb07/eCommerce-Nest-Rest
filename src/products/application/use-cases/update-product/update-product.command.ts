export class UpdateProductCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly sku?: string,
    public readonly priceAmount?: number,
    public readonly priceCurrency?: string,
    public readonly stock?: number,
    public readonly lowStockThreshold?: number,
    public readonly isAvailable?: boolean,
  ) {}
}
