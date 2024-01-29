import { ClientError } from '@errors/client.error';
import { cryptPassword, cryptPrivateKey } from '@libraries/crypto/crypto.lib';
import { comparePassword } from '@libraries/crypto/decrypt.lib';
import { Injectable } from '@nestjs/common';
import { ClientLogger } from '@utils/logger.util';
import { Web3Client } from 'providers/ethereum/web3.pvd';
import { LoginedClientItem, LoginedClientKey } from 'types/account/client.type';
import { AccountPrismaLibrary } from './account-prisma.pvd';

@Injectable()
export class ClientProvider {
  private clientMap: WeakMap<LoginedClientKey, LoginedClientItem>;

  constructor(
    private readonly prisma: AccountPrismaLibrary,
    private readonly client: Web3Client,
  ) {
    this.clientMap = new WeakMap();
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

      this.setItem(uuid, email);

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
      const isExist = this.searchKey(clientUuid);

      if (!isExist)
        throw new ClientError('[ACCOUNT] Create Account', 'Create Account Error. Please Login and Try Again.');

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

  async getClientBalance(from: string) {
    try {
      const isExist = this.searchKey(from);

      if (!isExist) throw new ClientError('[BALANCE] Get Balance', 'User is Not Logined. Reject Reqeust.');

      const balance = await this.client.getBalance(from);

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
    this.deleteItem(clientUuid);

    return 'success';
  }

  private searchKey(key: string) {
    const isExist = this.clientMap.has({ key });

    return isExist;
  }

  private setItem(uuid: string, address: string) {
    const isExist = this.searchKey(uuid);

    if (isExist) throw new ClientError('[LOGIN] Search Already Logined', 'Found Already Logined Client. Reject.');

    this.clientMap.set({ key: uuid }, { item: address });
  }

  private deleteItem(uuid: string) {
    const isExist = this.searchKey(uuid);

    if (!isExist) throw new ClientError('[LOGIN] Search Logined Client', 'Not Found Logined Client. Reject.');

    this.clientMap.delete({ key: uuid });
  }
}
