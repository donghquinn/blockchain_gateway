import { decrypt } from "@libraries/crypto/decrypt.lib";
import { decideNonce } from "@libraries/transaction/nonce.lib";
import { Injectable } from "@nestjs/common";
import { TransactionLogger } from "@utils/logger.util";
import { Web3Client } from "providers/ethereum/web3.pvd";
import { TransactionError } from "web3";
import { TransactionPrismaLibrary } from "./transaction-prisma.pvd";
import {
  decideBalance,
  subtractBalance,
} from "@libraries/transaction/balance.lib";

@Injectable()
export class TransactionProvider {
  constructor(
    private readonly client: Web3Client,
    private readonly prisma: TransactionPrismaLibrary,
  ) {}

  async sendTransaction(
    from: string,
    to: string,
    value: bigint,
    gas: bigint,
    clientUuid: string,
  ) {
    try {
      const txUuid = await this.prisma.insertNewTransaction(
        from,
        to,
        value,
        gas,
      );

      const {
        privateKey,
        pkToken,
        balance: dbBalance,
        nonce: dbNonce,
      } = await this.prisma.getPkandAccountData(from);
      const networkBalance = await this.client.getBalance(from);
      const balance = decideBalance(networkBalance, dbBalance);

      const decryptedPrivateKey = decrypt(privateKey, pkToken);

      const gasPrice = await this.client.getGasPrice();
      await this.prisma.updateTransactionGasPrice(from, txUuid, gasPrice);

      const networkNonce = await this.client.getNonce(from);
      const nonce = decideNonce(networkNonce, dbNonce);

      await this.prisma.updateTransactionNonce(from, txUuid, nonce);

      const signedTx = await this.client.sendTransaction(
        from,
        to,
        decryptedPrivateKey,
        gas,
        gasPrice,
        value,
        nonce,
      );

      const subtractedBalance = subtractBalance(balance, value);

      await this.prisma.updateSentTransactionStatus(
        from,
        txUuid,
        signedTx.transactionHash,
        nonce,
        subtractedBalance,
      );

      return signedTx.transactionHash;
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
