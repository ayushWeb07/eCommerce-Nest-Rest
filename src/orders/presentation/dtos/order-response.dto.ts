import { OrderItemResponseDto } from './order-item-response.dto';
import { Order } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';

export class OrderResponseDto {
  id: string;
  customerId: string;

  items: OrderItemResponseDto[];

  totalAmount: number;
  totalCurrency: string;
  status: string;

  shippingStreet: string;
  shippingCity: string;
  shippingPincode: string;
  shippingState: string;
  shippingCountry: string;

  trackingId: string | null;
  additionalNotes: string | null;

  createdAt: string;
  updatedAt: string;

  static fromDomainEntity(order: Order): OrderResponseDto {
    // create the dto entity and assign corresponding properties
    const orderDto = new OrderResponseDto();

    orderDto.id = order.id.getValue();
    orderDto.customerId = order.customerId;

    orderDto.items = order.items.map((item: OrderItem): OrderItemResponseDto =>
      OrderItemResponseDto.fromDomainEntity(item),
    );

    orderDto.totalAmount = order.getTotal().getAmount();
    orderDto.totalCurrency = order.getTotal().getCurrency();
    orderDto.status = order.status.getValue();

    orderDto.shippingStreet = order.shippingAddress.street;
    orderDto.shippingCity = order.shippingAddress.city;
    orderDto.shippingPincode = order.shippingAddress.pincode;
    orderDto.shippingState = order.shippingAddress.state;
    orderDto.shippingCountry = order.shippingAddress.country;

    orderDto.trackingId = order.trackingId;
    orderDto.additionalNotes = order.additionalNotes;
    orderDto.createdAt = order.createdAt.toISOString();
    orderDto.updatedAt = order.updatedAt.toISOString();

    return orderDto;
  }
}
