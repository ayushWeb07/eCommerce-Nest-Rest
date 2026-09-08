import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand, CreateOrderItemDto } from './create-order.command';
import { Inject } from '@nestjs/common';
import { ORDER_REPOSITORY_TOKEN } from '../../ports/order.repository.constants';
import type { OrderRepository } from '../../ports/order.repository.port';
import { Order } from '../../../domain/entities/order.entity';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../../shared/domain/exceptions/application.exception';
import { OrderItem } from '../../../domain/entities/order-item.entity';
import { ShippingAddressVo } from '../../../domain/value-objects/shipping-address.vo';
import type { CustomerPort } from '../../ports/customer.port';
import type { ProductPort } from '../../ports/product.port';
import { CUSTOMER_TOKEN } from '../../ports/customer.constants';
import { PRODUCT_TOKEN } from '../../ports/product.constants';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY_TOKEN)
    private readonly orderRepository: OrderRepository,

    @Inject(CUSTOMER_TOKEN)
    private readonly customerPort: CustomerPort,

    @Inject(PRODUCT_TOKEN)
    private readonly productPort: ProductPort,
  ) {}

  async execute(command: CreateOrderCommand): Promise<void> {
    // check if customer actually exists
    const customerExists: boolean = await this.customerPort.checkIfExists(
      command.customerId,
    );

    if (!customerExists) {
      throw new ApplicationException(
        'Such customer does not exist',
        ApplicationExceptionStatus.NOT_FOUND,
      );
    }

    // check if all products actually exists
    for (const orderItem of command.items) {
      // fetch the product using the products repo
      const productExists: boolean = await this.productPort.checkIfExists(
        orderItem.productId,
      );

      if (!productExists) {
        throw new ApplicationException(
          `Product with id '${orderItem.productId}' does not exist`,
          ApplicationExceptionStatus.NOT_FOUND,
        );
      }
    }

    // convert order items from dto to domain entities
    const orderItems: OrderItem[] = command.items.map(
      (item: CreateOrderItemDto): OrderItem =>
        OrderItem.create(
          item.productId,
          item.productName,
          item.unitPriceAmount,
          item.quantity,
          item?.discountAmount ?? null,
          item.unitPriceCurrency,
        ),
    );

    // craft the shipping address vo
    const shippingAddressVo = ShippingAddressVo.create({
      street: command.shippingStreet,
      city: command.shippingCity,
      pincode: command.shippingPincode,
      state: command.shippingState,
      country: command.shippingCountry,
    });

    // create the order domain entity
    const newOrder = Order.create(
      command.customerId,
      orderItems,
      shippingAddressVo,
      command.additionalNotes,
    );

    // create the order using the orders repo
    await this.orderRepository.saveOrder(newOrder);
  }
}
