/* eslint-disable class-methods-use-this */
import { Injectable } from '@nestjs/common';
import { ManagerLogger } from '@utils/logger.util';
import { LoginedClientItem, LoginedClientKey } from 'types/account/client.type';

@Injectable()
export class AccountManager {
  private clientMap: WeakMap<LoginedClientKey, LoginedClientItem>;

  private keyList: Array<LoginedClientKey>;

  constructor() {
    this.clientMap = new WeakMap<LoginedClientKey, LoginedClientItem>();
    this.keyList = [];
  }

  public userLogin(uuid: string, email: string) {
    const key = { key: uuid };

    const foundKey = this.keyList.find((item) => item === key);

    if (foundKey !== undefined) {
      ManagerLogger.info('[MANAGER] Key is found from Key List. Ignore.');

      return null;
    }

    const foundItem = this.findItem(key);

    if (foundItem !== null) {
      ManagerLogger.debug('[LOGIN] User Login Item is found. Ignore: %o', {
        uuid,
        email,
        foundItem,
      });
      ManagerLogger.info('[MANAGER] Item is found. Ignore.');

      return null;
    }

    this.setItem(key, email);

    const interval = 1000 * 60 * 10;

    const timer = setInterval(() => {
      const item = this.findItem(key);

      if (item === undefined) {
        ManagerLogger.debug('[MANAGER] No User Found during 10minutes. Ignore: %o', {
          key: uuid,
          item: email,
        });

        clearInterval(timer);

        return;
      }

      this.deleteItem(uuid);

      ManagerLogger.info('[MANAGER] Account Managing Delete User Finished');
    }, interval);

    return uuid;
  }

  public setItem(key: LoginedClientKey, email: string) {
    this.keyList.push(key);
    this.clientMap.set(key, { item: email });

    ManagerLogger.debug('[MANAGER] Set Item Finished: %o', {
      keyList: this.keyList,
      clientMap: this.clientMap,
    });
  }

  public findItem(key: LoginedClientKey): LoginedClientItem | null {
    const emailItem = this.clientMap.get(key);

    if (emailItem === undefined) {
      ManagerLogger.info('[MANAGER] No Item Found.');

      return null;
    }

    return emailItem;
  }

  public deleteItem(uuid: string) {
    const key: LoginedClientKey = { key: uuid };
    const foundIndex = this.keyList.findIndex((item) => item === key);

    if (foundIndex > -1) this.keyList.slice(foundIndex, 1);

    this.clientMap.delete(key);

    ManagerLogger.debug('[ACCOUNT] Item Deleted: %o', {
      key: uuid,
      foundIndex,
      map: this.clientMap,
    });
  }
}
