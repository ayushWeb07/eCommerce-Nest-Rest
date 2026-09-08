import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { CreateOrderCommand } from '../../application/use-cases/create-order/create-order.command';

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
}
