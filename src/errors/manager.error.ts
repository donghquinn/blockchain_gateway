export class ManagerError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.name = '[Manager Error]';
    this.type = type;
    this.cause = cause;
  }
}
