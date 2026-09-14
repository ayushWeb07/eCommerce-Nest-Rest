import { UniqueIdVo } from '../../../shared/domain/value-objects/unique-id.vo';

export class PaymentIdVo extends UniqueIdVo {
  constructor(id: string) {
    super(id);
  }
}
