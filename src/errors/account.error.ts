export class AccountError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.name = "[Account Error]";
    this.type = type;
    this.cause = cause;
  }
}
