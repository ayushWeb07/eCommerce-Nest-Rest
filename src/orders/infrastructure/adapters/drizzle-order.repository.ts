import { OrderRepository } from '../../application/ports/order.repository.port';
import { Inject, Injectable } from '@nestjs/common';
import { DRIZZLE_PROVIDER_TOKEN } from '../../../shared/infrastructure/database/drizzle/drizzle.constants';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../../shared/infrastructure/database/drizzle/schemas';
import { Order } from 'src/orders/domain/entities/order.entity';
import { OrderIdVo } from 'src/orders/domain/value-objects/order-id.vo';
import { SelectOrderType } from '../../../shared/infrastructure/database/drizzle/types/order.type';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { SelectOrderItemType } from '../../../shared/infrastructure/database/drizzle/types/order-item.type';
import {
  orderItems,
  orders,
} from '../../../shared/infrastructure/database/drizzle/schemas';
import { UniqueIdVo } from '../../../shared/domain/value-objects/unique-id.vo';
import { MoneyVo } from '../../../shared/domain/value-objects/money.vo';
import { ShippingAddressVo } from '../../domain/value-objects/shipping-address.vo';
import { OrderStatusVo } from '../../domain/value-objects/order-status.vo';
import { eq } from 'drizzle-orm';
import { Order_OrderItemType } from '../../../shared/infrastructure/database/drizzle/types/order-orderItem.type';

@Injectable()
class DrizzleOrderRepository implements OrderRepository {
  constructor(
    @Inject(DRIZZLE_PROVIDER_TOKEN)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async save(order: Order): Promise<void> {
    // convert the order to drizzle
    const orderDrizzleRow: SelectOrderType =
      DrizzleOrderRepository.toOrderDrizzleSchema(order);

    // convert the order items to drizzle
    const orderItemsDrizzleRows: SelectOrderItemType[] = order.items.map(
      (item: OrderItem): SelectOrderItemType =>
        DrizzleOrderRepository.toOrderItemDrizzleSchema(
          item,
          order.id.getValue(),
        ),
    );

    await this.db.transaction(async (tx): Promise<void> => {
      // insert the order into the db
      await tx.insert(orders).values(orderDrizzleRow);

      // insert the order items into the db
      if (orderItemsDrizzleRows.length > 0) {
        await tx.insert(orderItems).values(orderItemsDrizzleRows);
      }
    });
  }

  async findById(orderId: OrderIdVo): Promise<Order | null> {
    // query the order along with its items from the db
    const fetchedOrder: Order_OrderItemType | undefined =
      await this.db.query.orders.findFirst({
        where: eq(orders.id, orderId.getValue()),

        with: {
          orderItems: true,
        },
      });

    if (!fetchedOrder) {
      return null;
    }

    return DrizzleOrderRepository.toOrderDomainEntity(
      fetchedOrder,
      fetchedOrder.orderItems,
    );
  }

  async findByCustomerId(customerId: string): Promise<Order | null> {
    // query the order along with its items from the db
    const fetchedOrder: Order_OrderItemType | undefined =
      await this.db.query.orders.findFirst({
        where: eq(orders.customerId, customerId),

        with: {
          orderItems: true,
        },
      });

    if (!fetchedOrder) {
      return null;
    }

    return DrizzleOrderRepository.toOrderDomainEntity(
      fetchedOrder,
      fetchedOrder.orderItems,
    );
  }

  async findAll(): Promise<Order[]> {
    // query the orders along with their items from the db
    const fetchedOrders: Order_OrderItemType[] | undefined =
      await this.db.query.orders.findMany({
        with: {
          orderItems: true,
        },
      });

    // convert the drizzle rows to domain entity
    return fetchedOrders.map((fetchedOrder: Order_OrderItemType): Order =>
      DrizzleOrderRepository.toOrderDomainEntity(
        fetchedOrder,
        fetchedOrder.orderItems,
      ),
    );
  }

  async deleteOrderById(orderId: OrderIdVo): Promise<void> {
    // delete the order from the db
    await this.db.delete(orders).where(eq(orders.id, orderId.getValue()));
  }

  async deleteOrderItemById(orderItemId: UniqueIdVo): Promise<void> {
    // delete the order item from the db
    await this.db
      .delete(orderItems)
      .where(eq(orderItems.id, orderItemId.getValue()));
  }

  async updateOrder(order: Order): Promise<void> {
    // convert the order to drizzle
    const orderDrizzleRow: SelectOrderType =
      DrizzleOrderRepository.toOrderDrizzleSchema(order);

    // update the product from the db
    await this.db
      .update(orders)
      .set(orderDrizzleRow)
      .where(eq(orders.id, order.id.getValue()));
  }

  async updateOrderItem(orderItem: OrderItem, orderId: string): Promise<void> {
    // convert the order item to drizzle
    const orderItemDrizzleRow: SelectOrderItemType =
      DrizzleOrderRepository.toOrderItemDrizzleSchema(orderItem, orderId);

    // update the product from the db
    await this.db
      .update(orderItems)
      .set(orderItemDrizzleRow)
      .where(eq(orderItems.id, orderItem.id.getValue()));
  }

  private static toOrderDrizzleSchema(order: Order): SelectOrderType {
    return {
      id: order.id.getValue(),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      customerId: order.customerId,
      totalAmount: order.getTotal().getAmount(),
      totalCurrency: order.getTotal().getCurrency(),
      status: order.status.getValue(),
      shippingStreet: order.shippingAddress.street,
      shippingCity: order.shippingAddress.city,
      shippingPincode: order.shippingAddress.pincode,
      shippingState: order.shippingAddress.state,
      shippingCountry: order.shippingAddress.country,
      trackingId: order.trackingId,
      additionalNotes: order.additionalNotes,
    };
  }

  private static toOrderItemDrizzleSchema(
    orderItem: OrderItem,
    orderId: string,
  ): SelectOrderItemType {
    return {
      id: orderItem.id.getValue(),
      createdAt: orderItem.createdAt,
      updatedAt: orderItem.updatedAt,
      orderId,
      productId: orderItem.productId,
      productName: orderItem.productName,
      unitPriceAmount: orderItem.unitPrice.getAmount(),
      unitPriceCurrency: orderItem.unitPrice.getCurrency(),
      discountAmount:
        orderItem?.discount !== null ? orderItem.discount.getAmount() : null,
      quantity: orderItem.quantity,
    };
  }

  private static toOrderDomainEntity(
    row: SelectOrderType,
    items: SelectOrderItemType[],
  ): Order {
    // create the order id vo
    const orderIdVo = new OrderIdVo(row.id);

    // craft the shipping address vo
    const shippingAddressVo = ShippingAddressVo.create({
      street: row.shippingStreet,
      city: row.shippingCity,
      pincode: row.shippingPincode,
      state: row.shippingState,
      country: row.shippingCountry,
    });

    // craft the status vo
    const orderStatusVo = OrderStatusVo.fromString(row.status);

    // convert order items to domain entities
    const orderItemsVos: OrderItem[] = items.map(
      (item: SelectOrderItemType): OrderItem =>
        DrizzleOrderRepository.toOrderItemDomainEntity(item),
    );

    return Order.reconstitute({
      id: orderIdVo,
      customerId: row.customerId,
      shippingAddress: shippingAddressVo,
      items: orderItemsVos,
      status: orderStatusVo,
      trackingId: row.trackingId,
      additionalNotes: row.additionalNotes,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  private static toOrderItemDomainEntity(row: SelectOrderItemType): OrderItem {
    // create the id vo
    const idVo = new UniqueIdVo(row.id);

    // craft the unit price vo
    const unitPriceVo = MoneyVo.create(
      row.unitPriceAmount,
      row.unitPriceCurrency,
    );

    // craft the discount vo
    const discountVo =
      row.discountAmount !== null
        ? MoneyVo.create(row.discountAmount, row.unitPriceCurrency)
        : null;

    return OrderItem.reconstitute({
      id: idVo,
      productId: row.productId,
      productName: row.productName,
      unitPrice: unitPriceVo,
      quantity: row.quantity,
      discount: discountVo,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}

export default DrizzleOrderRepository;
