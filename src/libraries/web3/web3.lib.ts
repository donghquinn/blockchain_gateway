import { MariadbClass } from '@libraries/database/mariadb.lib';
import Web3 from 'web3';

export class Web3Class {
  private static instance: Web3Class;

  private web3: Web3;

  private rpcUrl: string | null;

  private dbConnection: MariadbClass | null;

  constructor(url: string) {
    this.rpcUrl = url;

    this.web3 = new Web3(new Web3.providers.HttpProvider(this.rpcUrl));

    this.dbConnection = MariadbClass.getInstance();
  }
    
    public createAccount() {
        const account = this.web3.eth.accounts.create();

        return account;
    }
}
