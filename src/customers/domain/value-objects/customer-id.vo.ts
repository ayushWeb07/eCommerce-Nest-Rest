import { UniqueIdVo } from '../../../shared/domain/value-objects/unique-id.vo';

export class CustomerIdVo extends UniqueIdVo {
  constructor(id: string) {
    super(id);
  }
}
