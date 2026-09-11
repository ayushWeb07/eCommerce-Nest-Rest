import { UniqueIdVo } from '../../../shared/domain/value-objects/unique-id.vo';

export class OrderIdVo extends UniqueIdVo {
  constructor(id: string) {
    super(id);
  }
}
