import { PrismaError } from '@errors/prisma.error';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaLogger, TransactionLogger } from '@utils/logger.util';
import { TransactionError } from 'web3';

@Injectable()
export class TransactionPrismaLibrary extends PrismaClient {
  async getPkandAccountData(from: string) {
    try {
      const result = await this.account.findFirst({
        select: {
          privateKey: true,
          pkToken: true,
          balance: true,
          nonce: true,
        },
        where: {
          address: from,
        },
      });

      if (result === null) {
        PrismaLogger.error('[PK_ACCOUNT] Query Result is Null: %o', { from });

        throw new TransactionError(
          '[PK_ACCOUNT] Query Private Key and Account Data',
          'Query Private Key is empty. Please Try Again.',
        );
      }
      const { privateKey, pkToken, balance, nonce } = result;

      return { privateKey, pkToken, balance, nonce };
    } catch (error) {
      PrismaLogger.error('[PK_ACCOUNT] Query Private Key and Account Data Error: %o', {
        error,
      });

      throw new PrismaError(
        '[PK_ACCOUNT]  Query Private Key and Account Data',
        ' Query Private Key and Account Data Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async getNonce(from: string): Promise<bigint> {
    try {
      const result = await this.account.findFirst({
        select: {
          nonce: true,
        },
        where: {
          address: from,
        },
      });

      if (result === null) {
        PrismaLogger.error('[NONCE] Get Nonce is Null');

        throw new TransactionError('[NONCE] Get Nonce', 'Get Nonce Error. Please Try again.');
      }

      return result.nonce;
    } catch (error) {
      PrismaLogger.error('[NONCE] Get Nonce Error: %o', {
        error,
      });

      throw new PrismaError(
        '[NONCE] Get Nonce',
        'Get Nonce Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async insertNewTransaction(from: string, to: string, value: bigint, gas: bigint): Promise<string> {
    try {
      const { uuid } = await this.transaction.create({
        data: {
          from,
          to,
          value,
          gas,
          status: 'created',
        },
      });

      return uuid;
    } catch (error) {
      PrismaLogger.error('[TX_INSERT] Insert New Transaction Error: %o', {
        error,
      });

      throw new PrismaError(
        '[TX_INSERT] Insert New Transaction',
        'Insert New Transaction Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async updateTransactionGasPrice(from: string, txUuid: string, gasPrice: bigint): Promise<void> {
    try {
      await this.transaction.update({
        data: {
          from,
          gasPrice,
          status: 'GasPrice Updated',
        },
        where: {
          from,
          uuid: txUuid,
        },
      });
    } catch (error) {
      PrismaLogger.error('[TX_GAS_PRICE] Update Transaction Gas Price Error: %o', {
        error,
      });

      throw new PrismaError(
        '[TX_GAS_PRICE] Update Transaction Gas Price',
        'Update Transaction Gas Price Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async updateTransactionNonce(from: string, txUuid: string, nonce: bigint): Promise<void> {
    try {
      await this.transaction.update({
        data: {
          from,
          nonce,
          status: 'Nonce Updated',
        },
        where: {
          from,
          uuid: txUuid,
        },
      });
    } catch (error) {
      PrismaLogger.error('[TX_NONCE] Update Transaction Nonce Error: %o', {
        error,
      });

      throw new PrismaError(
        '[TX_NONCE] Update Transaction Nonce',
        'Update Transaction Nonce Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async updateTransactionSigned(from: string, txUuid: string, txHash: string): Promise<void> {
    try {
      await this.transaction.update({
        data: {
          txHash,
          status: 'Transaction Signed',
        },
        where: {
          from,
          uuid: txUuid,
        },
      });
    } catch (error) {
      PrismaLogger.error('[TX_SIGN] Update Signed Transaction Info Error: %o', {
        error,
      });

      throw new PrismaError(
        '[TX_SIGN] Update Signed Transaction Info',
        'Update Signed Transaction Info Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async updateSentTransactionStatus(
    from: string,
    txUuid: string,
    txHash: string,
    nonce: bigint,
    subtractedBalance: bigint,
  ): Promise<void> {
    try {
      await this.transaction.update({
        data: {
          txHash,
          status: 'Success',
        },
        where: {
          from,
          uuid: txUuid,
        },
      });

      const addedNonce = nonce + 1n;

      TransactionLogger.info('Nonce Add: %o', {
        nonce,
        addedNonce,
      });

      await this.account.update({
        data: {
          nonce: addedNonce,
          balance: subtractedBalance,
        },
        where: {
          address: from,
        },
      });
    } catch (error) {
      PrismaLogger.error('[TX_SENT] Update Sent Transaction Info Error: %o', {
        error,
      });

      throw new PrismaError(
        '[TX_SENT] Update Sent Transaction Info',
        'Update Sent Transaction Info Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
