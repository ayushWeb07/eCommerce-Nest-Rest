import { OrderStatusValue } from '../../../domain/value-objects/order-status.vo';

export class UpdateStatusCommand {
  constructor(
    public readonly id: string,
    public readonly status: OrderStatusValue,
  ) {}
}
