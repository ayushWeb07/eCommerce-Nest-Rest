import { SelectOrderType } from './order.type';
import { SelectOrderItemType } from './order-item.type';

export type Order_OrderItemType = SelectOrderType & {
  orderItems: SelectOrderItemType[];
};
