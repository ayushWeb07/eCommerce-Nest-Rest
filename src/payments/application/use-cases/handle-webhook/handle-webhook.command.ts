export class HandleWebhookCommand {
  constructor(
    public readonly payload: Buffer,
    public readonly signature: string,
  ) {}
}
