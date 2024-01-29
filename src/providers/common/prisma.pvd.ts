import { PrismaError } from "@errors/prisma.error";
import { Web3Error } from "@errors/web3.error";
import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaLibrary extends PrismaClient {
  async insertNewAccountInfo(
    address: string,
    privateKey: string,
    password: string,
    passwordToken: string,
    pkToken: string,
  ): Promise<void> {
    try {
      await this.account.create({
        data: {
          address,
          password,
          passwordToken,
          pkToken,
          privateKey,
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
