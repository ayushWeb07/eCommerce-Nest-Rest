export interface INotificationProps {
  customerId: string;
  subject: string;
  message: string;
}

export interface NotificationPort {
  sendNotification(props: INotificationProps): Promise<void>;
}
