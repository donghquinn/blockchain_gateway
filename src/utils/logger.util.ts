import path from 'path';
import { fileURLToPath } from 'url';
import Winston from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);
const dirSaveName = path.join(dirName, '..', '..', 'logs');

// 로그 포맷 설정
const { colorize, combine, timestamp: defaultTimestamp, printf, splat, json } = Winston.format;

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
const formatted = printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`);

class WinstonLogger {
  private static instance: WinstonLogger;

  private logger: Winston.Logger;

  private clientLogger: Winston.Logger;

  private managerLogger: Winston.Logger;

  private transactionLogger: Winston.Logger;

  private prismaLogger: Winston.Logger;

  private blockchainLogger: Winston.Logger;

  private constructor() {
    this.prismaLogger = Winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: combine(splat(), json(), colorize(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new Winston.transports.Console(),
        new WinstonDaily({
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.prisma.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.blockchainLogger = Winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: combine(splat(), json(), colorize(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new Winston.transports.Console(),
        new WinstonDaily({
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.blockchain.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.managerLogger = Winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: combine(splat(), json(), colorize(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new Winston.transports.Console(),
        new WinstonDaily({
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.manager.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.clientLogger = Winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: combine(splat(), json(), colorize(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new Winston.transports.Console(),
        new WinstonDaily({
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.client.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.transactionLogger = Winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: combine(splat(), json(), colorize(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new Winston.transports.Console(),
        new WinstonDaily({
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.transaction.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.logger = Winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: combine(splat(), json(), colorize(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new Winston.transports.Console(),
        new WinstonDaily({
          level: 'error',
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.error.log',
          maxFiles: 100,
          zippedArchive: true,
        }),
        new WinstonDaily({
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          format: formatted,
          filename: '%DATE%.combined.log',
          maxFiles: 100,
          zippedArchive: true,
        }),
      ],
    });
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new WinstonLogger();
    }

    return {
      Logger: this.instance.logger,
      TransactionLogger: this.instance.transactionLogger,
      ClientLogger: this.instance.clientLogger,
      ManagerLogger: this.instance.managerLogger,
      PrismaLogger: this.instance.prismaLogger,
      BlockchainLogger: this.instance.blockchainLogger,
    };
  }
}

export const { Logger, TransactionLogger, ClientLogger, ManagerLogger, PrismaLogger, BlockchainLogger } =
  WinstonLogger.getInstance();
