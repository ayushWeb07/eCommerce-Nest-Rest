export interface OrderPort {
  checkIfOrderExists(orderId: string): Promise<boolean>;
}
