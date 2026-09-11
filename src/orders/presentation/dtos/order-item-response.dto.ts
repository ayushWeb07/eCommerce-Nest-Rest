import { OrderItem } from '../../domain/entities/order-item.entity';

export class OrderItemResponseDto {
  id: string;
  productId: string;
  productName: string;

  unitPriceAmount: number;
  unitPriceCurrency: string;
  quantity: number;
  subtotal: number;

  discountAmount: number | null;

  static fromDomainEntity(orderItem: OrderItem): OrderItemResponseDto {
    // create the dto entity and assign corresponding properties
    const orderItemDto = new OrderItemResponseDto();

    orderItemDto.id = orderItem.id.getValue();
    orderItemDto.productId = orderItem.productId;
    orderItemDto.productName = orderItem.productName;
    orderItemDto.unitPriceAmount = orderItem.unitPrice.getAmount();
    orderItemDto.unitPriceCurrency = orderItem.unitPrice.getCurrency();
    orderItemDto.quantity = orderItem.quantity;
    orderItemDto.subtotal = orderItem.getSubtotal().getAmount();
    orderItemDto.discountAmount = orderItem.discount?.getAmount() ?? null;

    return orderItemDto;
  }
}
