export class AuthError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.name = '[Auth Error]';
    this.type = type;
    this.cause = cause;
  }
}
