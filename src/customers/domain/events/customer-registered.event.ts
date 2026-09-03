export class CustomerRegisteredEvent {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly email: string,
  ) {}
}
