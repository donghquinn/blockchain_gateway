export class PrismaError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.name = '[Prisma Error]';
    this.type = type;
    this.cause = cause;
  }
}
