export class ValidatorError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.name = "[Validator Error]";
    this.type = type;
    this.cause = cause;
  }
}
