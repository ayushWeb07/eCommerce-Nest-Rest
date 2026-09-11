import { OrderPort } from '../application/ports/order.port';
import { Inject, Injectable } from '@nestjs/common';
import { ORDER_REPOSITORY_TOKEN } from '../../orders/application/ports/order.repository.constants';
import type { OrderRepository } from '../../orders/application/ports/order.repository.port';
import { OrderIdVo } from '../../orders/domain/value-objects/order-id.vo';
import { Order } from '../../orders/domain/entities/order.entity';

@Injectable()
class OrderAdapter implements OrderPort {
  constructor(
    @Inject(ORDER_REPOSITORY_TOKEN)
    private readonly orderRepository: OrderRepository,
  ) {}

  async checkIfOrderExists(orderId: string): Promise<boolean> {
    const fetchedOrder: Order | null = await this.orderRepository.findOrderById(
      new OrderIdVo(orderId),
    );

    return fetchedOrder !== null;
  }
}

export default OrderAdapter;
