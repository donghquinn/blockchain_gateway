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
    const foundItem = this.findItem(key);

    if (foundItem === undefined) {
      ManagerLogger.debug('[LOGIN] User Login Item is not found: %o', {
        uuid,
        email,
        foundItem,
      });

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
    const foundItem = this.keyList.find((item) => item === key);

    if (foundItem === undefined) {
      ManagerLogger.info('[MANAGER] No Key is not found froun Key List. Ignore.');

      return null;
    }

    const emailItem = this.clientMap.get(key);

    if (emailItem === undefined) {
      ManagerLogger.info('[MANAGER] No Item Found. Ignore.');

      return null;
    }

    return emailItem;
  }

  public deleteItem(uuid: string) {
    const foundIndex = this.keyList.findIndex((item) => item.key === uuid);

    if (foundIndex > -1) this.keyList.slice(foundIndex, 1);

    this.clientMap.delete({ key: uuid });
  }
}
