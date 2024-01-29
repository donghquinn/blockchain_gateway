export class TransactionError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.name = "[Transaction Error]";
    this.type = type;
    this.cause = cause;
  }
}
