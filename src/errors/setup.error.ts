export class SetupError extends Error {
  name: string;

  type: string;

  cause?: Error;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.name = 'SetupError';
    this.type = type;
    this.cause = cause;
  }
}
