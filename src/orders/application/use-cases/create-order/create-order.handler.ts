import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand, CreateOrderItemDto } from './create-order.command';
import { Inject } from '@nestjs/common';
import { ORDER_REPOSITORY_TOKEN } from '../../ports/order.repository.constants';
import type { OrderRepository } from '../../ports/order.repository.port';
import { Order } from '../../../domain/entities/order.entity';
import { CUSTOMER_REPOSITORY_TOKEN } from '../../../../customers/application/ports/customer.repository.constants';
import type { CustomerRepository } from '../../../../customers/application/ports/customer.repository.port';
import { PRODUCT_REPOSITORY_TOKEN } from '../../../../products/application/ports/product.repository.constants';
import type { ProductRepository } from '../../../../products/application/ports/product.repository.port';
import { CustomerIdVo } from '../../../../customers/domain/value-objects/customer-id.vo';
import {
  ApplicationException,
  ApplicationExceptionStatus,
} from '../../../../shared/domain/exceptions/application.exception';
import { Customer } from '../../../../customers/domain/entities/customer.entity';
import { ProductIdVo } from '../../../../products/domain/value-objects/product-id.vo';
import { Product } from '../../../../products/domain/entities/product.entity';
import { OrderItem } from '../../../domain/entities/order-item.entity';
import { ShippingAddressVo } from '../../../domain/value-objects/shipping-address.vo';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @Inject(ORDER_REPOSITORY_TOKEN)
    private readonly orderRepository: OrderRepository,

    @Inject(CUSTOMER_REPOSITORY_TOKEN)
    private readonly customerRepository: CustomerRepository,

    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(command: CreateOrderCommand): Promise<void> {
    // check if customer actually exists
    const fetchedCustomer: Customer | null =
      await this.customerRepository.findById(
        new CustomerIdVo(command.customerId),
      );

    if (!fetchedCustomer) {
      throw new ApplicationException(
        'Such customer does not exist',
        ApplicationExceptionStatus.NOT_FOUND,
      );
    }

    // check if all products actually exists
    for (const orderItem of command.items) {
      // fetch the product using the products repo
      const fetchedProduct: Product | null =
        await this.productRepository.findById(
          new ProductIdVo(orderItem.productId),
        );

      if (!fetchedProduct) {
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
