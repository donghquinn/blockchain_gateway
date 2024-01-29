import { Web3Error } from "@errors/web3.error";
import { Injectable } from "@nestjs/common";
import Web3, { Transaction } from "web3";

@Injectable()
export class Web3Client {
  private client: Web3;

  private provider: string | undefined;

  constructor() {
    this.provider =
      process.env.ALCHEMY_RPC !== undefined
        ? process.env.ALCHEMY_RPC
        : // It's not exist rpc url. Can be replaced if you have own network
          "https://dong-rpc.donghyuns.com";

    this.client = new Web3(new Web3.providers.HttpProvider(this.provider));
  }

  public createAccount() {
    try {
      const accountInfo = this.client.eth.accounts.create();

      return accountInfo;
    } catch (error) {
      throw new Web3Error(
        "[ADDRESS] Create Address",
        "Create Address Error.",
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
        "[NONCE] Get Nonce",
        "Get Nonce Error.",
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
        "[BALANCE] Get Balance",
        "Get Balance Error.",
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
        "[NONCE] Get Nonce",
        "Get Nonce Error.",
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async sendTransaction(
    from: string,
    to: string,
    privateKey: string,
    gas: bigint,
    gasPrice: bigint,
    value: bigint,
    nonce: bigint,
  ) {
    try {
      const account = this.client.eth.accounts.privateKeyToAccount(privateKey);

      const rawTransaction: Transaction = {
        from,
        to,
        value,
        gas,
        gasPrice,
        nonce,
      };

      const signedTx = await account.signTransaction(rawTransaction);

      return signedTx;
    } catch (error) {
      throw new Web3Error(
        "[SIGN] Sign Transction",
        "Sign Transaction Error. Please Try Again.",
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
