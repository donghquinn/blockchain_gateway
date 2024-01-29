import { ClientError } from "@errors/client.error";
import { cryptPassword, cryptPrivateKey } from "@libraries/crypto/crypto.lib";
import { comparePassword } from "@libraries/crypto/decrypt.lib";
import { Injectable } from "@nestjs/common";
import { PrismaLibrary } from "providers/common/prisma.pvd";
import { Web3Client } from "providers/ethereum/web3.pvd";

@Injectable()
export class ClientProvider {
  constructor(
    private readonly prisma: PrismaLibrary,
    private readonly client: Web3Client,
  ) {}

  async createClient(email: string, password: string) {
    try {
      const { encodedPassword, passwordToken } = cryptPassword(password);

      const uuid = await this.prisma.insertNewClientInfo(
        email,
        encodedPassword,
        passwordToken,
      );

      return uuid;
    } catch (error) {
      throw new ClientError(
        "[CREATE] Create Account",
        "Create Account Error. Please Try Again.",
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async login(email: string, password: string) {
    try {
      const {
        uuid,
        password: dbPassword,
        passwordToken,
      } = await this.prisma.selectPasswordToken(email);

      const isValid = comparePassword(password, dbPassword, passwordToken);

      if (!isValid)
        throw new ClientError(
          "[LOGIN] Compare Password",
          "Given Password is not matching with Client's. Please Check and Try Again.",
        );

      return uuid;
    } catch (error) {
      throw new ClientError(
        "[CREATE] Create Account",
        "Create Account Error. Please Try Again.",
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async createAccount(email: string, clientUuid: string) {
    try {
      const { address, privateKey } = this.client.createAccount();

      const { encodedPrivateKey, pkToken } = cryptPrivateKey(privateKey);

      await this.prisma.insertNewAccountInfo(
        email,
        encodedPrivateKey,
        pkToken,
        clientUuid,
      );

      return address;
    } catch (error) {
      throw new ClientError(
        "[CREATE] Create Account",
        "Create Account Error. Please Try Again.",
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
