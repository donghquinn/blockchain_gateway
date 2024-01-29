import { PrismaError } from "@errors/prisma.error";
import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PrismaLogger } from "@utils/logger.util";

@Injectable()
export class TransactionPrismaLibrary extends PrismaClient {
  async getPk(from: string) {
    try {
      const result = await this.account.findFirst({
        select: {
          privateKey: true,
          pkToken: true,
        },
        where: {
          address: from,
        },
      });

      if (result === null) {
        PrismaLogger.error("[PK] Query Result is Null: %o", { from });

        throw new PrismaError(
          "[PK] Query Private Key",
          "Query Private Key is empty. Please Try Again.",
        );
      }
      const { privateKey, pkToken } = result;

      return { privateKey, pkToken };
    } catch (error) {
      throw new PrismaError(
        "[PK] Get Private Key",
        "Get Private Key Error. Please Try Again.",
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
        PrismaLogger.error("[NONCE] Get Nonce is Null");

        throw new PrismaError(
          "[NONCE] Get Nonce",
          "Get Nonce Error. Please Try again.",
        );
      }

      return result.nonce;
    } catch (error) {
      PrismaLogger.error("[ACCOUNT] Insert New Client Error: %o", {
        error,
      });

      throw new PrismaError(
        "[ACCOUNT] Insert New Client Info",
        "Insert New Client Info Error. Please Try Again.",
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async insertNewTransaction(
    from: string,
    to: string,
    value: bigint,
    gas: bigint,
  ): Promise<string> {
    try {
      const { uuid } = await this.transaction.create({
        data: {
          from,
          to,
          value,
          gas,
          status: "created",
        },
      });

      return uuid;
    } catch (error) {
      throw new PrismaError(
        "[PK] Get Private Key",
        "Get Private Key Error. Please Try Again.",
      );
    }
  }

  async updateTransactionGasPrice(
    from: string,
    txUuid: string,
    gasPrice: bigint,
  ): Promise<void> {
    try {
      await this.transaction.update({
        data: {
          from,
          gasPrice,
          status: "GasPrice Updated",
        },
        where: {
          from,
          uuid: txUuid,
        },
      });
    } catch (error) {
      throw new PrismaError(
        "[PK] Get Private Key",
        "Get Private Key Error. Please Try Again.",
      );
    }
  }

  async updateTransactionNonce(
    from: string,
    txUuid: string,
    nonce: bigint,
  ): Promise<void> {
    try {
      await this.transaction.update({
        data: {
          from,
          nonce,
          status: "Nonce Updated",
        },
        where: {
          from,
          uuid: txUuid,
        },
      });
    } catch (error) {
      throw new PrismaError(
        "[PK] Get Private Key",
        "Get Private Key Error. Please Try Again.",
      );
    }
  }

  async updateSentTransactionStatus(
    from: string,
    txUuid: string,
    txHash: string,
  ): Promise<void> {
    try {
      await this.transaction.update({
        data: {
          txHash,
          status: "Success",
        },
        where: {
          from,
          uuid: txUuid,
        },
      });
    } catch (error) {
      throw new PrismaError(
        "[PK] Get Private Key",
        "Get Private Key Error. Please Try Again.",
      );
    }
  }
}
