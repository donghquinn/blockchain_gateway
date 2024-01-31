import { ClientError } from '@errors/client.error';
import { cryptPassword } from '@libraries/crypto/crypto.lib';
import { comparePassword } from '@libraries/crypto/decrypt.lib';
import { Injectable } from '@nestjs/common';
import { AccountPrismaLibrary } from '@providers/common/account-prisma.pvd';
import { ClientManager } from '@providers/manager/client-manager.pvd';
import { ClientLogger } from '@utils/logger.util';

@Injectable()
export class ClientProvider {
  constructor(
    private readonly prisma: AccountPrismaLibrary,
    private readonly accountManager: ClientManager,
  ) {}

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

      this.accountManager.userLogin(uuid, email);

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

  logout(clientUuid: string) {
    const result = this.accountManager.deleteItem(clientUuid);

    if (result === null) {
      ClientLogger.debug('[LOGOUT] Not Found Key. Ignore: %o', {
        clientUuid,
        result,
      });

      throw new ClientError('[LOGOUT] Delete Logined User', 'No User Found. Ignore');
    }

    ClientLogger.debug('[LOGOUT] Logout: %o', {
      result,
      clientUuid,
    });

    return 'success';
  }
}
