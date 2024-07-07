import { MariadbClass } from '@libraries/database/mariadb.lib';
import { encryptString } from '@utilities/crypto.util';
import { encodeBase64 } from '@utilities/encoding.util';
import { insertNewAccountInfoQuery } from 'queries/users/user.sql';
import Web3 from 'web3';

export class Web3Class {
  private static instance: Web3Class;

  private web3: Web3;

  private rpcUrl: string | null;

  private dbConnection: MariadbClass;

  constructor(url: string) {
    this.rpcUrl = url;

    this.web3 = new Web3(new Web3.providers.HttpProvider(this.rpcUrl));

    this.dbConnection = MariadbClass.getInstance();
  }

  public static getInstance(url: string) {
    if (!this.instance) {
      this.instance = new Web3Class(url);
    }

    return this.instance;
  }

  public async createAccount(userId: string, networkSeq: number) {
    try {
      const account = this.web3.eth.accounts.create();

      const encryptedPk = encryptString(account.privateKey);

      const encodedPk = encodeBase64(encryptedPk);

      await this.dbConnection.query(insertNewAccountInfoQuery, [userId, networkSeq, account.address, encodedPk]);

      return account;
    } catch (error) {
      throw new Error('[WEB3] Create Account Error');
    }
  }
}
