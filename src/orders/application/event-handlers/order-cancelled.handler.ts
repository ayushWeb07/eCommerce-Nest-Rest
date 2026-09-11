import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderCancelledEvent } from '../../domain/events/order-cancelled.event';
import { Inject } from '@nestjs/common';
import { NOTIFICATION_SERVICE_TOKEN } from '../../../customers/application/ports/notification.constants';
import type { NotificationPort } from '../../../customers/application/ports/notification.port';

@EventsHandler(OrderCancelledEvent)
export class OrderCancelledHandler implements IEventHandler<OrderCancelledEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE_TOKEN)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderCancelledEvent): Promise<void> {
    // call the notification service
    await this.notificationService.sendNotification({
      customerId: event.customerId,
      subject: `Your order is cancelled`,
      message: `Your order with id ${event.orderId} has been successfully cancelled`,
    });
  }
}
