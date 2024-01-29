import { decrypt } from "@libraries/crypto/decrypt.lib";
import { decideNonce } from "@libraries/transaction/nonce.lib";
import { Injectable } from "@nestjs/common";
import { TransactionLogger } from "@utils/logger.util";
import { Web3Client } from "providers/ethereum/web3.pvd";
import { Transaction } from "web3";
import { TransactionPrismaLibrary } from "./transaction-prisma.pvd";
import {
  decideBalance,
  subtractBalance,
} from "@libraries/transaction/balance.lib";
import { TransactionError } from "@errors/transaction.error";

@Injectable()
export class TransactionProvider {
  constructor(
    private readonly client: Web3Client,
    private readonly prisma: TransactionPrismaLibrary,
  ) {}

  async sendTransaction(from: string, to: string, value: bigint, gas: bigint) {
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

      // Create Balance from DB and Network. Network Balance has higher priority.
      const networkBalance = await this.client.getBalance(from);
      const balance = decideBalance(networkBalance, dbBalance);

      // Decrypt Encrypted PrivateKey
      const decryptedPrivateKey = decrypt(privateKey, pkToken);

      const gasPrice = await this.client.getGasPrice();
      await this.prisma.updateTransactionGasPrice(from, txUuid, gasPrice);

      // Compare Db Nonce and Network Nonce. Network Nonce has higher priority
      const networkNonce = await this.client.getNonce(from);
      const nonce = decideNonce(networkNonce, dbNonce);

      await this.prisma.updateTransactionNonce(from, txUuid, nonce);

      // create Raw Transaction
      const rawTx = this.createTransaction(
        from,
        to,
        nonce,
        value,
        gas,
        gasPrice,
      );

      // Sign and Send
      const signedTx = await this.client.sendTransaction(
        decryptedPrivateKey,
        rawTx,
      );

      // Balance Subtraction
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
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  createTransaction(
    from: string,
    to: string,
    nonce: bigint,
    value: bigint,
    gas: bigint,
    gasPrice: bigint,
  ) {
    const rawTransaction: Transaction = {
      from,
      to,
      value,
      gas,
      gasPrice,
      nonce,
    };

    return rawTransaction;
  }
}
