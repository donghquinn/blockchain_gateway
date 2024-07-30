export class BlockError extends Error {
  name: string;

  type: string;

  cause?: Error;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.name = 'BlockError';
    this.type = type;
    this.cause = cause;
  }
}
