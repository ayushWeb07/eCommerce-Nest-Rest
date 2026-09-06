import { Order } from '../../domain/entities/order.entity';
import { OrderIdVo } from '../../domain/value-objects/order-id.vo';

export interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(orderId: OrderIdVo): Promise<Order | null>;
  findByCustomerId(customerId: string): Promise<Order | null>;
  findAll(): Promise<Order[]>;
  deleteById(orderId: OrderIdVo): Promise<void>;
  update(order: Order): Promise<void>;
}
