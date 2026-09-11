import { MoneyVo } from '../../../shared/domain/value-objects/money.vo';
import { OrderIdVo } from '../../../orders/domain/value-objects/order-id.vo';
import { SkuVo } from '../../../products/domain/value-objects/sku.vo';
import { PaymentIdVo } from '../../domain/value-objects/payment-id.vo';

export interface CreateCheckoutSessionResult {
  sessionId: string;
  url: string;
}

export interface CheckoutSessionMetadata {
  orderId: OrderIdVo;
  paymentId: PaymentIdVo;
}

export interface CheckoutUrls {
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutItem {
  productName: string;
  productDescription: string;
  productSku: SkuVo;

  price: MoneyVo;
  quantity: number;
}

export interface PaymentGateway {
  createCheckoutSession(
    items: CheckoutItem[],
    metadata: CheckoutSessionMetadata,
    urls?: CheckoutUrls,
  ): Promise<CreateCheckoutSessionResult>;

  constructWebhookEvent(payload: Buffer, signature: string): any;
}
