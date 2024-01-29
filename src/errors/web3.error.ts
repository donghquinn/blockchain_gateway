export class Web3Error extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.name = "[Web3 Error]";
    this.type = type;
    this.cause = cause;
  }
}
