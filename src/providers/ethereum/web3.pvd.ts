import { Web3Error } from "@errors/web3.error";
import { Injectable } from "@nestjs/common";
import Web3 from "web3";

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
}
