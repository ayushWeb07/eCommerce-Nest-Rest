export class OrderConfirmedEvent {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
  ) {}
}
