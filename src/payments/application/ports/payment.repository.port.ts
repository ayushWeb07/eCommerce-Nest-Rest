import { Payment } from '../../domain/entities/payment.entity';
import { PaymentIdVo } from '../../domain/value-objects/payment-id.vo';

export interface PaymentRepository {
  savePayment(payment: Payment): Promise<void>;
  findPaymentByOrderId(orderId: string): Promise<Payment | null>;
  findPaymentById(paymentId: PaymentIdVo): Promise<Payment | null>;
  updatePayment(payment: Payment): Promise<void>;
}
