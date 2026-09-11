export class ShipOrderCommand {
  constructor(
    public readonly orderId: string,
    public readonly trackingId: string,
  ) {}
}
