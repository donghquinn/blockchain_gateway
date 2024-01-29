export class ClientError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.name = '[Client Error]';
    this.type = type;
    this.cause = cause;
  }
}
