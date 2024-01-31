import { ClientError } from '@errors/client.error';
import { cryptPrivateKey } from '@libraries/crypto/crypto.lib';
import { Injectable } from '@nestjs/common';
import { ClientManager } from '@providers/manager/client-manager.pvd';
import { ClientLogger } from '@utils/logger.util';
import { Web3Client } from '@providers/ethereum/web3.pvd';
import { AccountPrismaLibrary } from '@providers/common/account-prisma.pvd';

@Injectable()
export class AccountProvider {
  // private accountManager: AccountManager;
  constructor(
    private readonly prisma: AccountPrismaLibrary,
    private readonly client: Web3Client,
    private readonly accountManager: ClientManager,
  ) {}

  async createAccount(clientUuid: string) {
    try {
      const userItem = this.accountManager.findItem(clientUuid);

      if (userItem === null) {
        ClientLogger.debug('[ACCOUNT] No Logined User: %o', {
          clientUuid,
          userItem,
        });

        throw new ClientError('[ACCOUNT] Create Account', 'User is Not Logined. Please Login and Try Again.');
      }

      ClientLogger.debug('[ACCOUNT] Found Logined User: %o', {
        clientUuid,
        userItem,
      });

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

  async getClientBalance(clientUuid: string, address: string) {
    try {
      const userItem = this.accountManager.findItem(clientUuid);

      if (userItem === null) throw new ClientError('[BALANCE] Search Key', 'No Logined User Found');

      const balance = await this.client.getBalance(address);

      ClientLogger.debug('[BALANCE] Got Balance: %o', {
        userItem,
        balance,
      });

      return balance.toString();
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

  async getAccountList(clientUuid: string) {
    try {
      const userItem = this.accountManager.findItem(clientUuid);

      if (userItem === null) throw new ClientError('[BALANCE] Search Key', 'No Logined User Found');

      const address = await this.prisma.selectAddressList(clientUuid);

      ClientLogger.debug('[BALANCE] Got Address List: %o', {
        userItem,
        address,
      });

      return address;
    } catch (error) {
      ClientLogger.error('[BALANCE] Get Address List Error: %o', {
        error,
      });

      throw new ClientError(
        '[BALANCE] Address List',
        'Address List Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
