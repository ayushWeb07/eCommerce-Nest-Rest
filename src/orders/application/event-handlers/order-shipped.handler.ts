import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderShippedEvent } from '../../domain/events/order-shipped.event';
import { Inject } from '@nestjs/common';
import { NOTIFICATION_SERVICE_TOKEN } from '../../../customers/application/ports/notification.constants';
import type { NotificationPort } from '../../../customers/application/ports/notification.port';

@EventsHandler(OrderShippedEvent)
export class OrderShippedHandler implements IEventHandler<OrderShippedEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE_TOKEN)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderShippedEvent): Promise<void> {
    // call the notification service
    await this.notificationService.sendNotification({
      customerId: event.customerId,
      subject: `Your order is being shipped`,
      message: `Your order with id ${event.orderId} is being shipped. Please use this for tracking on DTDC: ${event.trackingId}`,
    });
  }
}
