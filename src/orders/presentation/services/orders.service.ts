import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { CreateOrderCommand } from '../../application/use-cases/create-order/create-order.command';
import { FindAllOrdersByCustomerIdQuery } from '../../application/use-cases/find-all-orders-by-customer-id/find-all-orders-by-customer-id.query';
import { FindAllOrdersByCustomerIdDto } from '../dtos/find-all-orders-by-customer-id.dto';
import { Order } from '../../domain/entities/order.entity';
import { OrderResponseDto } from '../dtos/order-response.dto';
import { FindOrderByIdDto } from '../dtos/find-order-by-id.dto';
import { FindOrderByIdQuery } from '../../application/use-cases/find-order-by-id/find-order-by-id.query';
import { FindAllOrdersQuery } from '../../application/use-cases/find-all-orders/find-all-orders.query';
import { UpdateStatusCommand } from '../../application/use-cases/update-status/update-status.command';
import { UpdateOrderStatusDto } from '../dtos/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<void> {
    // execute the create order command
    await this.commandBus.execute(
      new CreateOrderCommand(
        createOrderDto.customerId,
        createOrderDto.items,

        createOrderDto.shippingStreet,
        createOrderDto.shippingCity,
        createOrderDto.shippingPincode,
        createOrderDto.shippingState,
        createOrderDto.shippingCountry,

        createOrderDto?.additionalNotes ?? null,
      ),
    );
  }

  async findAllOrdersByCustomerId(
    findAllOrdersByCustomerIdDto: FindAllOrdersByCustomerIdDto,
  ): Promise<OrderResponseDto[]> {
    // execute the find all orders query
    const fetchedOrders: Order[] = await this.queryBus.execute(
      new FindAllOrdersByCustomerIdQuery(
        findAllOrdersByCustomerIdDto.customerId,
      ),
    );

    // convert them from order entities to order response dto
    return fetchedOrders.map((order: Order): OrderResponseDto =>
      OrderResponseDto.fromDomainEntity(order),
    );
  }

  async findOrderById(
    findOrderByIdDto: FindOrderByIdDto,
  ): Promise<OrderResponseDto> {
    // execute the find order by id query
    const fetchedOrder: Order = await this.queryBus.execute(
      new FindOrderByIdQuery(findOrderByIdDto.id),
    );

    // convert them from order entity to order response dto
    return OrderResponseDto.fromDomainEntity(fetchedOrder);
  }

  async findAllOrders(): Promise<OrderResponseDto[]> {
    // execute the find all orders query
    const fetchedOrders: Order[] = await this.queryBus.execute(
      new FindAllOrdersQuery(),
    );

    // convert them from order entities to order response dto
    return fetchedOrders.map((order: Order): OrderResponseDto =>
      OrderResponseDto.fromDomainEntity(order),
    );
  }

  async confirmOrder(
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<void> {
    // execute the update order command
    await this.commandBus.execute(
      new UpdateStatusCommand(updateOrderStatusDto.id, 'confirmed'),
    );
  }
}
