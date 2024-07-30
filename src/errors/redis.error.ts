export class RedisError extends Error {
  name: string;

  type: string;

  cause?: Error;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.name = 'RedisError';
    this.type = type;
    this.cause = cause;
  }
}
