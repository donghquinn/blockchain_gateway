import { decrypt } from "@libraries/crypto/decrypt.lib";
import { decideNonce } from "@libraries/ethereum/nonce.lib";
import { Injectable } from "@nestjs/common";
import { TransactionLogger } from "@utils/logger.util";
import { PrismaLibrary } from "providers/common/prisma.pvd";
import { Web3Client } from "providers/ethereum/web3.pvd";
import { TransactionError } from "web3";

@Injectable()
export class TransactionProvider {
  constructor(
    private readonly client: Web3Client,
    private readonly prisma: PrismaLibrary,
  ) {}

  async sendTransaction(
    from: string,
    to: string,
    value: bigint,
    gas: bigint,
    clientUuid: string,
  ) {
    try {
      const { privateKey, pkToken } = await this.prisma.getPk(from);

      const decryptedPrivateKey = decrypt(privateKey, pkToken);

      const gasPrice = await this.client.getGasPrice();
      const dbNonce = await this.prisma.getNonce(from);
      const networkNonce = await this.client.getNonce(from);

      const nonce = decideNonce(networkNonce, dbNonce);

      const signedTx = await this.client.sendTransaction(
        from,
        to,
        decryptedPrivateKey,
        gas,
        gasPrice,
        value,
        nonce,
      );
    } catch (error) {
      TransactionLogger.error("[SEND] Send Transaction Error: %o", {
        error,
      });

      throw new TransactionError(
        "[SEND] Send Transaction",
        "Send Transaction Error. Please Try Again.",
      );
    }
  }
}
