import { AccountError } from "@errors/account.error";
import { cryptPasswordAndPk } from "@libraries/crypto/password.lib";
import { Injectable } from "@nestjs/common";
import { PrismaLibrary } from "providers/common/prisma.pvd";
import { Web3Client } from "providers/ethereum/web3.pvd";

@Injectable()
export class AccountProvider {
  constructor(
    private readonly prisma: PrismaLibrary,
    private readonly client: Web3Client,
  ) {}

  async createAccount(password: string) {
    try {
      const { address, privateKey } = this.client.createAccount();

      const { encodedPassword, passwordToken, encodedPrivateKey, pkToken } =
        cryptPasswordAndPk(password, privateKey);

      await this.prisma.insertNewAccountInfo(
        address,
        encodedPrivateKey,
        encodedPassword,
        passwordToken,
        pkToken,
      );

      return address;
    } catch (error) {
      throw new AccountError(
        "[CREATE] Create Account",
        "Create Account Error. Please Try Again.",
      );
    }
  }
}
