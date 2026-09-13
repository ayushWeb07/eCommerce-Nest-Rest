import {
  OrderPricing,
  OrderPricingItem,
  OrderPricingPort,
} from '../../application/ports/order-pricing.port';
import { Inject, Injectable } from '@nestjs/common';
import { ORDER_REPOSITORY_TOKEN } from '../../../orders/application/ports/order.repository.constants';
import type { OrderRepository } from '../../../orders/application/ports/order.repository.port';
import { OrderIdVo } from '../../../orders/domain/value-objects/order-id.vo';
import { Order } from '../../../orders/domain/entities/order.entity';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../shared/domain/exceptions/application.exception';
import { MoneyVo } from '../../../shared/domain/value-objects/money.vo';
import { OrderItem } from '../../../orders/domain/entities/order-item.entity';

@Injectable()
class OrderPricingAdapter implements OrderPricingPort {
  constructor(
    @Inject(ORDER_REPOSITORY_TOKEN)
    private readonly orderRepository: OrderRepository,
  ) {}

  async getOrderPricing(orderId: string): Promise<OrderPricing | null> {
    // check if such order even exists
    const fetchedOrder: Order | null = await this.orderRepository.findOrderById(
      new OrderIdVo(orderId),
    );

    if (fetchedOrder === null) {
      return null;
    }

    return {
      totalAmount: fetchedOrder.getTotal(),

      items: fetchedOrder.items.map((item: OrderItem): OrderPricingItem => ({
        productName: item.productName,
        unitPrice: item.getSubtotal(),
        quantity: item.quantity,
      })),
    };
  }
}

export default OrderPricingAdapter;
