import { Payment } from '../../domain/entities/payment.entity';

export interface PaymentRepositoryPort {
  savePayment(payment: Payment): Promise<void>;
  findPaymentByOrderId(orderId: string): Promise<Payment | null>;
}
