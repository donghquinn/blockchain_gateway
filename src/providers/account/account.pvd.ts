import { ClientError } from '@errors/client.error';
import { AccountManager } from '@libraries/account/account.manager';
import { cryptPassword, cryptPrivateKey } from '@libraries/crypto/crypto.lib';
import { comparePassword } from '@libraries/crypto/decrypt.lib';
import { Injectable } from '@nestjs/common';
import { ClientLogger } from '@utils/logger.util';
import { Web3Client } from 'providers/ethereum/web3.pvd';
import { AccountPrismaLibrary } from './account-prisma.pvd';

@Injectable()
export class ClientProvider {
  private accountManager: AccountManager;

  constructor(
    private readonly prisma: AccountPrismaLibrary,
    private readonly client: Web3Client,
  ) {
    this.accountManager = AccountManager.getInstance();

  }

  async createClient(email: string, password: string) {
    try {
      const { encodedPassword, passwordToken } = cryptPassword(password);

      const uuid = await this.prisma.insertNewClientInfo(email, encodedPassword, passwordToken);

      return uuid;
    } catch (error) {
      ClientLogger.error('[CLIENT] Create Account Error: %o', {
        error,
      });

      throw new ClientError(
        '[CLIENT] Create Account',
        'Create Account Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async login(email: string, password: string): Promise<string> {
    try {
      const { uuid, password: dbPassword, passwordToken } = await this.prisma.selectPasswordToken(email);

      const isValid = comparePassword(password, dbPassword, passwordToken);

      if (!isValid) {
        ClientLogger.error('[LOGIN] Compare Password is Not Matching');

        throw new ClientError(
          '[LOGIN] Compare Password',
          "Given Password is not matching with Client's. Please Check and Try Again.",
        );
      }

      ClientLogger.info('[LOGIN] Login Success');
      this.accountManager.setItem(uuid, email);

      ClientLogger.debug('[LOGIN] Set Item Finished: %o', {
        uuid,
        email,
      });

      return uuid;
    } catch (error) {
      ClientLogger.error('[LOGIN] Create Client Error: %o', {
        error,
      });

      throw new ClientError(
        '[LOGIN] Create Client',
        'Create Client Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async createAccount(clientUuid: string) {
    try {
      const isExist = this.accountManager.searchKey(clientUuid);

      if (!isExist)
        throw new ClientError('[ACCOUNT] Create Account', 'User is Not Logined. Please Login and Try Again.');

      const { address, privateKey } = this.client.createAccount();

      const { encodedPrivateKey, pkToken } = cryptPrivateKey(privateKey);

      await this.prisma.insertNewAccountInfo(address, encodedPrivateKey, pkToken, clientUuid);

      return address;
    } catch (error) {
      ClientLogger.error('[ACCOUNT] Create Account Error: %o', {
        error,
      });

      throw new ClientError(
        '[ACCOUNT] Create Account',
        'Create Account Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async getClientBalance(clientUuid: string) {
    try {
      const isExist = this.accountManager.searchKey(clientUuid);

      if (!isExist) throw new ClientError('[BALANCE] Get Balance', 'User is Not Logined. Reject Reqeust.');

      const address = this.accountManager.findItem(clientUuid);

      const balance = await this.client.getBalance(address.item);

      ClientLogger.debug('[BALANCE] Got Balance: %o', {
        address,
        balance,
      });

      return balance;
    } catch (error) {
      ClientLogger.error('[BALANCE] Get Balance Error: %o', {
        error,
      });

      throw new ClientError(
        '[BALANCE] Get Balance',
        'Get Balance Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  logout(clientUuid: string) {
    this.accountManager.deleteItem( clientUuid );
    
    ClientLogger.debug('[LOGOUT] Logout: %o', {
      clientUuid,
    });

    return 'success';
  }

 
}
