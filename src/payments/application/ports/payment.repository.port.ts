import { Payment } from '../../domain/entities/payment.entity';

export interface PaymentRepository {
  savePayment(payment: Payment): Promise<void>;
  findPaymentByOrderId(orderId: string): Promise<Payment | null>;
}
