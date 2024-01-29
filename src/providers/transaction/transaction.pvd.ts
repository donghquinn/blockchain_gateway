import { TransactionError } from '@errors/transaction.error';
import { decrypt } from '@libraries/crypto/decrypt.lib';
import { decideBalance, subtractBalance } from '@libraries/transaction/balance.lib';
import { decideNonce } from '@libraries/transaction/nonce.lib';
import { createTransaction, transactionHashtoString } from '@libraries/transaction/transaction.lib';
import { Injectable } from '@nestjs/common';
import { TransactionLogger } from '@utils/logger.util';
import { Web3Client } from 'providers/ethereum/web3.pvd';
import { TransactionPrismaLibrary } from './transaction-prisma.pvd';

@Injectable()
export class TransactionProvider {
  constructor(
    private readonly client: Web3Client,
    private readonly prisma: TransactionPrismaLibrary,
  ) {}

  async sendTransaction(from: string, to: string, value: bigint, gas: bigint) {
    try {
      const txUuid = await this.prisma.insertNewTransaction(from, to, value, gas);

      const { privateKey, pkToken, balance: dbBalance, nonce: dbNonce } = await this.prisma.getPkandAccountData(from);

      // Create Balance from DB and Network. Network Balance has higher priority.
      const networkBalance = await this.client.getBalance(from);
      const balance = decideBalance(networkBalance, dbBalance);

      TransactionLogger.debug('[SEND] Got Balance: %o', {
        dbBalance,
        networkBalance,
        selectedBalance: balance,
      });

      // Decrypt Encrypted PrivateKey
      const decryptedPrivateKey = decrypt(privateKey, pkToken);

      const gasPrice = await this.client.getGasPrice();
      await this.prisma.updateTransactionGasPrice(from, txUuid, gasPrice);

      // Compare Db Nonce and Network Nonce. Network Nonce has higher priority
      const networkNonce = await this.client.getNonce(from);
      const nonce = decideNonce(networkNonce, dbNonce);

      TransactionLogger.debug('[SEND] Got Balance: %o', {
        dbNonce,
        networkNonce,
        selectedNonce: nonce,
      });

      await this.prisma.updateTransactionNonce(from, txUuid, nonce);

      // create Raw Transaction
      const rawTx = createTransaction(from, to, nonce, value, gas, gasPrice);

      // Sign and Send
      const signedTx = await this.client.signTransaction(decryptedPrivateKey, rawTx);

      await this.prisma.updateTransactionSigned(from, txUuid, signedTx.transactionHash);

      const txReceipt = await this.client.sendTransaction(signedTx);

      const { transactionHash } = txReceipt;

      TransactionLogger.debug('[SEND] Got Tx Receipt: %o', {
        transactionHash,
      });

      const txHash = transactionHashtoString(transactionHash);

      // Balance Subtraction
      const subtractedBalance = subtractBalance(balance, value);
      const networkSubtractedBalance = await this.client.getBalance(from);
      const selectedNewBalance = decideBalance(networkSubtractedBalance, subtractedBalance);

      TransactionLogger.debug('[SEND] Subtracted Balance: %o', {
        subtractedBalance,
        networkSubtractedBalance,
        selectedNewBalance,
      });

      await this.prisma.updateSentTransactionStatus(from, txUuid, txHash, nonce, selectedNewBalance);

      return signedTx.transactionHash;
    } catch (error) {
      TransactionLogger.error('[SEND] Send Transaction Error: %o', {
        error,
      });

      throw new TransactionError(
        '[SEND] Send Transaction',
        'Send Transaction Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
