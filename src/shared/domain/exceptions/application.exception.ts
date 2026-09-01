export enum ApplicationExceptionStatus {
  BAD_REQUEST = 'BAD_REQUEST',
  INTERNAL_SERVER = 'INTERNAL_SERVER',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  FORBIDDEN = 'FORBIDDEN',
  CONFLICT = 'CONFLICT',
}

export class ApplicationException extends Error {
  constructor(
    message: string,
    public readonly code: ApplicationExceptionStatus = ApplicationExceptionStatus.INTERNAL_SERVER,
  ) {
    super(message);
    this.name = 'ApplicationException';
  }
}
