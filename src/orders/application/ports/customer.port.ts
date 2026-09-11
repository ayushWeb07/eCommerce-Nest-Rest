export interface CustomerPort {
  checkIfExists(customerId: string): Promise<boolean>;
}
