import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrdersService } from './services/orders.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { FindAllOrdersByCustomerIdDto } from './dtos/find-all-orders-by-customer-id.dto';
import { OrderResponseDto } from './dtos/order-response.dto';
import { FindOrderByIdDto } from './dtos/find-order-by-id.dto';
import { UpdateOrderStatusDto } from './dtos/update-order-status.dto';
import { ShipOrderDto } from './dtos/ship-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    // call the create order service
    await this.ordersService.createOrder(createOrderDto);

    return {
      success: true,
      message: 'Successfully created the new order',
    };
  }

  @Get('customers/:customerId')
  @HttpCode(HttpStatus.OK)
  async findAllOrdersByCustomerId(
    @Param() findAllOrdersByCustomerIdDto: FindAllOrdersByCustomerIdDto,
  ) {
    // call the find orders by customer id service
    const fetchedOrders: OrderResponseDto[] =
      await this.ordersService.findAllOrdersByCustomerId(
        findAllOrdersByCustomerIdDto,
      );

    return {
      success: true,
      message: 'Successfully fetched the orders by customer id',
      data: fetchedOrders,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOrderById(@Param() findOrderByIdDto: FindOrderByIdDto) {
    // call the find by id order service
    const fetchedOrder: OrderResponseDto =
      await this.ordersService.findOrderById(findOrderByIdDto);

    return {
      success: true,
      message: 'Successfully fetched the order by id',
      data: fetchedOrder,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAllOrders() {
    // call the find all orders service
    const fetchedOrders: OrderResponseDto[] =
      await this.ordersService.findAllOrders();

    return {
      success: true,
      message: 'Successfully fetched all the orders',
      data: fetchedOrders,
    };
  }

  @Patch('confirm/:id')
  @HttpCode(HttpStatus.OK)
  async confirmOrder(@Param() updateOrderStatusDto: UpdateOrderStatusDto) {
    // call the confirm order service
    await this.ordersService.confirmOrder(updateOrderStatusDto);

    return {
      success: true,
      message: 'Successfully confirmed the order',
    };
  }

  @Patch('ship')
  @HttpCode(HttpStatus.OK)
  async shipOrder(@Body() shipOrderDto: ShipOrderDto) {
    // call the ship order service
    await this.ordersService.shipOrder(shipOrderDto);

    return {
      success: true,
      message: 'Successfully updated the order status to shipped',
    };
  }

  @Patch('deliver/:id')
  @HttpCode(HttpStatus.OK)
  async deliverOrder(@Param() updateOrderStatusDto: UpdateOrderStatusDto) {
    // call the deliver order service
    await this.ordersService.deliverOrder(updateOrderStatusDto);

    return {
      success: true,
      message: 'Successfully delivered the order',
    };
  }

  @Patch('cancel/:id')
  @HttpCode(HttpStatus.OK)
  async cancelOrder(@Param() updateOrderStatusDto: UpdateOrderStatusDto) {
    // call the cancel order service
    await this.ordersService.cancelOrder(updateOrderStatusDto);

    return {
      success: true,
      message: 'Successfully cancelled the order',
    };
  }
}
