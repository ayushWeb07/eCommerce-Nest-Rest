export class CreateOrderItemDto {
  productId: string;
  productName: string;
  unitPriceAmount: number;
  unitPriceCurrency: string;
  quantity: number;
  discountAmount?: number;
}

export class CreateOrderCommand {
  constructor(
    public readonly customerId: string,
    public readonly items: CreateOrderItemDto[],

    public readonly shippingStreet: string,
    public readonly shippingCity: string,
    public readonly shippingPincode: string,
    public readonly shippingState: string,
    public readonly shippingCountry: string,

    public readonly additionalNotes: string | null,
  ) {}
}
