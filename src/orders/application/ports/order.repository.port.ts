import { Order } from '../../domain/entities/order.entity';
import { OrderIdVo } from '../../domain/value-objects/order-id.vo';
import { UniqueIdVo } from '../../../shared/domain/value-objects/unique-id.vo';
import { OrderItem } from '../../domain/entities/order-item.entity';

export interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(orderId: OrderIdVo): Promise<Order | null>;
  findByCustomerId(customerId: string): Promise<Order | null>;
  findAll(): Promise<Order[]>;
  deleteOrderById(orderId: OrderIdVo): Promise<void>;
  updateOrder(order: Order): Promise<void>;
  deleteOrderItemById(orderItemId: UniqueIdVo): Promise<void>;
  updateOrderItem(orderItem: OrderItem): Promise<void>;
}
