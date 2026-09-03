import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CustomerRegisteredEvent } from '../../domain/events/customer-registered.event';
import { Inject } from '@nestjs/common';
import { NOTIFICATION_SERVICE_TOKEN } from '../ports/notification.constants';
import type { NotificationPort } from '../ports/notification.port';

@EventsHandler(CustomerRegisteredEvent)
export class CustomerRegisteredHandler implements IEventHandler<CustomerRegisteredEvent> {
  constructor(
    @Inject(NOTIFICATION_SERVICE_TOKEN)
    private readonly notificationService: NotificationPort,
  ) {}

  handle(event: CustomerRegisteredEvent) {
    this.notificationService.sendNotification({
      recipient: event.email,
      subject: `${event.firstName} registered as customer`,
      message: `Customer with name ${event.firstName} and id ${event.id}, has been successfully registered`,
    });
  }
}
