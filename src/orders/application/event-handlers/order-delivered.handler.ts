import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { NOTIFICATION_SERVICE_TOKEN } from '../../../customers/application/ports/notification.constants';
import type { NotificationPort } from '../../../customers/application/ports/notification.port';
import { OrderDeliveredEvent } from '../../domain/events/order-delivered.event';

@EventsHandler(OrderDeliveredEvent)
export class OrderDeliveredHandler implements IEventHandler<OrderDeliveredEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE_TOKEN)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderDeliveredEvent): Promise<void> {
    // call the notification service
    await this.notificationService.sendNotification({
      customerId: event.customerId,
      subject: `Your order is delivered`,
      message: `Your order with id ${event.orderId} has been successfully delivered`,
    });
  }
}
