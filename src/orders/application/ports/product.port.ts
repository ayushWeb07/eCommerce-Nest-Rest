export interface ProductPort {
  checkIfExists(productId: string): Promise<boolean>;
}
