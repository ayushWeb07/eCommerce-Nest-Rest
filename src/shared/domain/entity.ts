import { UniqueIdVo } from './value-objects/unique-id.vo';

export abstract class Entity<T extends UniqueIdVo = UniqueIdVo> {
  constructor(protected readonly id: T) {}

  getId(): T {
    return this.id;
  }

  equals(other: Entity<T>): boolean {
    if (!other) return false;

    if (this === other) return true;

    return this.id.equals(other.getId());
  }
}
