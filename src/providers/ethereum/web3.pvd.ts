import { Web3Error } from '@errors/web3.error';
import { Injectable } from '@nestjs/common';
import { BlockchainLogger } from '@utils/logger.util';
import { SignedTransaction } from 'types/transaction/transaction.type';
import Web3, { Transaction } from 'web3';

@Injectable()
export class Web3Client {
  private client: Web3;

  private provider: string | undefined;

  constructor() {
    this.provider =
      process.env.ALCHEMY_RPC !== undefined
        ? process.env.ALCHEMY_RPC
        : // It's not exist rpc url. Can be replaced if you have own network
          'https://dong-rpc.donghyuns.com';

    this.client = new Web3(new Web3.providers.HttpProvider(this.provider));
  }

  public createAccount() {
    try {
      const accountInfo = this.client.eth.accounts.create();

      BlockchainLogger.debug('[ACCOUNT] Create Account: %o', {
        accountInfo,
      });

      return accountInfo;
    } catch (error) {
      throw new Web3Error(
        '[ADDRESS] Create Address',
        'Create Address Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  public async getNonce(from: string) {
    try {
      const nonceValue = await this.client.eth.getTransactionCount(from);

      return nonceValue;
    } catch (error) {
      throw new Web3Error(
        '[NONCE] Get Nonce',
        'Get Nonce Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  public async getBalance(from: string) {
    try {
      const balance = await this.client.eth.getBalance(from);

      return balance;
    } catch (error) {
      throw new Web3Error(
        '[BALANCE] Get Balance',
        'Get Balance Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  public async getGasPrice() {
    try {
      const gasPrice = await this.client.eth.getGasPrice();

      return gasPrice;
    } catch (error) {
      throw new Web3Error(
        '[NONCE] Get Nonce',
        'Get Nonce Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async signTransaction(privateKey: string, rawTx: Transaction) {
    try {
      const account = this.client.eth.accounts.privateKeyToAccount(privateKey);

      const signedTx = await account.signTransaction(rawTx);

      return signedTx;
    } catch (error) {
      throw new Web3Error(
        '[SIGN] Sign Transction',
        'Sign Transaction Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async sendTransaction(signedTx: SignedTransaction) {
    try {
      const txReceipt = await this.client.eth.sendSignedTransaction(signedTx.rawTransaction);

      return txReceipt;
    } catch (error) {
      throw new Web3Error(
        '[SEND] Sign Transction',
        'Sign Transaction Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
