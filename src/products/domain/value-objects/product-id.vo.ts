import { UniqueIdVo } from '../../../shared/domain/value-objects/unique-id.vo';

export class ProductIdVo extends UniqueIdVo {
  constructor(id: string) {
    super(id);
  }
}
