import { PrismaError } from "@errors/prisma.error";
import { Web3Error } from "@errors/web3.error";
import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaLibrary extends PrismaClient {
  async insertNewClientInfo(
    email: string,
    password: string,
    passwordToken: string,
  ): Promise<string> {
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
      throw new PrismaError(
        "[ACCOUNT] Insert New Client Info",
        "Insert New Client Info Error. Please Try Again.",
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async insertNewAccountInfo(
    address: string,
    privateKey: string,
    pkToken: string,
    clientUuid: string,
  ): Promise<void> {
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
      throw new PrismaError(
        "[ACCOUNT] Insert New Account Info",
        "Insert New Account Info Error. Please Try Again.",
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
