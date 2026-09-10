import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { NOTIFICATION_SERVICE_TOKEN } from '../../../customers/application/ports/notification.constants';
import type { NotificationPort } from '../../../customers/application/ports/notification.port';
import { OrderConfirmedEvent } from '../../domain/events/order-confirmed.event';

@EventsHandler(OrderConfirmedEvent)
export class OrderConfirmedHandler implements IEventHandler<OrderConfirmedEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE_TOKEN)
    private readonly notificationService: NotificationPort,
  ) {}

  async handle(event: OrderConfirmedEvent): Promise<void> {
    // call the notification service
    await this.notificationService.sendNotification({
      customerId: event.customerId,
      subject: `Your order is confirmed`,
      message: `Your order with id ${event.orderId} has been successfully confirmed, and is ready for shipment`,
    });
  }
}
