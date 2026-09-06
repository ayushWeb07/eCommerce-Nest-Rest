import { OrderItem } from '../../../domain/entities/order-item.entity';
import { ShippingAddressVo } from '../../../domain/value-objects/shipping-address.vo';

export class CreateOrderCommand {
  constructor(
    public readonly customerId: string,
    public readonly items: OrderItem[],
    public readonly shippingAddress: ShippingAddressVo,
    public readonly additionalNotes: string | null,
  ) {}
}
