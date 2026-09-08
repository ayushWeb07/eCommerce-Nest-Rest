import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderPlacedEvent } from '../../domain/events/order-placed.event';
import { Inject } from '@nestjs/common';
import { NOTIFICATION_SERVICE_TOKEN } from '../../../customers/application/ports/notification.constants';
import type { NotificationPort } from '../../../customers/application/ports/notification.port';

@EventsHandler(OrderPlacedEvent)
export class OrderPlacedHandler implements IEventHandler<OrderPlacedEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE_TOKEN)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderPlacedEvent): Promise<void> {
    // call the notification service
    await this.notificationService.sendNotification({
      customerId: event.customerId,
      subject: `Successfully placed an order`,
      message: `Order with id ${event.orderId} has been successfully placed`,
    });
  }
}
