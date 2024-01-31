import { PrismaError } from '@errors/prisma.error';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaLogger } from '@utils/logger.util';

@Injectable()
export class AccountPrismaLibrary extends PrismaClient {
  async insertNewClientInfo(email: string, password: string, passwordToken: string): Promise<string> {
    try {
      const { uuid } = await this.client.create({
        data: {
          email,
          password,
          passwordToken,
        },
      });

      return uuid;
    } catch (error) {
      PrismaLogger.error('[ACCOUNT] Insert New Client Error: %o', {
        error,
      });

      throw new PrismaError(
        '[ACCOUNT] Insert New Client Info',
        'Insert New Client Info Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async insertNewAccountInfo(address: string, privateKey: string, pkToken: string, clientUuid: string): Promise<void> {
    try {
      await this.account.create({
        data: {
          address,
          pkToken,
          privateKey,
          clientUuid,
        },
      });
    } catch (error) {
      PrismaLogger.error('[ACCOUNT] Insert New Account Info Error: %o', { error });

      throw new PrismaError(
        '[ACCOUNT] Insert New Account Info',
        'Insert New Account Info Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async selectPasswordToken(email: string) {
    try {
      const result = await this.client.findFirst({
        select: {
          uuid: true,
          password: true,
          passwordToken: true,
        },
        where: {
          email,
        },
      });

      if (result === null) {
        PrismaLogger.error('[LOGIN] No Matching Data Found: %o', {
          email,
        });

        throw new PrismaError('[LOGIN] Bring Password Token', 'No Matching Data Found. Please Try Again.');
      }

      return result;
    } catch (error) {
      PrismaLogger.error('[LOGIN] Bring Password Token Error: %o', {
        error,
      });

      throw new PrismaError(
        '[LOGIN] Bring Password Token',
        'Bring Password Token Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async selectAddress(uuid: string) {
    try {
      const result = await this.account.findFirst({
        select: {
          address: true,
        },
        where: {
          clientUuid: uuid,
        },
      });

      if (result === null) {
        PrismaLogger.error('[ADDRESS] No Matching Data Found');

        throw new PrismaError('[ADDRESS] Bring Address', 'No Matching Address Found. Please Try Again.');
      }

      return result.address;
    } catch (error) {
      PrismaLogger.error('[ADDRESS] Bring Address Error: %o', {
        error,
      });

      throw new PrismaError(
        '[ADDRESS] Bring Address',
        'Bring Address Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
