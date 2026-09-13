import { MoneyVo } from '../../../shared/domain/value-objects/money.vo';

export interface OrderPricingItem {
  productName: string;
  unitPrice: MoneyVo;
  quantity: number;
}

export interface OrderPricing {
  totalAmount: MoneyVo;
  items: OrderPricingItem[];
}

export interface OrderPricingPort {
  getOrderPricing(orderId: string): Promise<OrderPricing | null>;
}
