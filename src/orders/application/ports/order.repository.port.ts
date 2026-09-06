import { Order } from '../../domain/entities/order.entity';
import { OrderIdVo } from '../../domain/value-objects/order-id.vo';
import { UniqueIdVo } from '../../../shared/domain/value-objects/unique-id.vo';
import { OrderItem } from '../../domain/entities/order-item.entity';

export interface OrderRepository {
  saveOrder(order: Order): Promise<void>;
  findOrderById(orderId: OrderIdVo): Promise<Order | null>;
  findAllOrdersByCustomerId(customerId: string): Promise<Order[]>;
  findAllOrders(): Promise<Order[]>;
  findOrderItemById(orderItemId: UniqueIdVo): Promise<OrderItem | null>;
  deleteOrderById(orderId: OrderIdVo): Promise<void>;
  updateOrder(order: Order): Promise<void>;
  deleteOrderItemById(orderItemId: UniqueIdVo): Promise<void>;
  updateOrderItem(orderItem: OrderItem, orderId: string): Promise<void>;
}
