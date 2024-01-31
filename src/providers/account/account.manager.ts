/* eslint-disable class-methods-use-this */
import { Injectable } from '@nestjs/common';
import { ManagerLogger } from '@utils/logger.util';
import { LoginedClientItem, LoginedClientKey } from 'types/account/client.type';

@Injectable()
export class AccountManager {
  private keyList: Array<LoginedClientKey>;

  private clientMap: WeakMap<LoginedClientKey, LoginedClientItem>;

  constructor() {
    this.keyList = [];
    this.clientMap = new WeakMap<LoginedClientKey, LoginedClientItem>();
  }

  public userLogin(uuid: string, email: string) {
    const foundKey = this.findKeyFromList(uuid);

    if (foundKey !== undefined) {
      ManagerLogger.info('[MANAGER] Key is found from Key List. Ignore.');

      return null;
    }

    const foundItem = this.findItem(uuid);

    if (foundItem !== null) {
      ManagerLogger.debug('[LOGIN] User Login Item is found. Ignore: %o', {
        uuid,
        email,
        foundItem,
      });

      ManagerLogger.info('[MANAGER] Item is found. Ignore.');

      return null;
    }

    const isSuccess = this.setItem(uuid, email);

    if (isSuccess === null) {
      ManagerLogger.debug('[MANGER] Found Already Logined Item. Ignore: %o', {
        foundItem,
        uuid,
        email,
        keyList: this.keyList,
        map: this.clientMap,
      });

      return null;
    }

    const interval = 1000 * 60 * 10;

    const timer = setInterval(() => {
      const item = this.findItem(uuid);

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

  public findIndexKeyFromList(uuid: string) {
    const foundIndex = this.keyList.findIndex((item) => item.key === uuid);

    return foundIndex;
  }

  public findKeyFromList(uuid: string) {
    const foundKey = this.keyList.find((item) => item.key === uuid);

    return foundKey;
  }

  public setItem(uuid: string, email: string) {
    const foundItem = this.keyList.findIndex((item) => item.key === uuid);

    if (foundItem > -1) {
      ManagerLogger.debug('[MANGER] Found Already Logined Item. Ignore: %o', {
        foundItem,
        email,
        uuid,
        keyList: this.keyList,
        map: this.clientMap,
      });

      return null;
    }

    const key = { key: uuid };
    this.keyList.push(key);
    this.clientMap.set(key, { item: email });

    ManagerLogger.debug('[MANAGER] Set Item Finished: %o', {
      keyList: this.keyList,
      clientMap: this.clientMap,
    });

    return email;
  }

  public findItem(uuid: string): LoginedClientItem | null {
    const key = this.keyList.find((item) => item.key === uuid);

    if (!key) return null;

    const emailItem = this.clientMap.get(key);

    if (emailItem === undefined) {
      ManagerLogger.debug('[MANAGER] No Item Found: %o', {
        key,
        list: this.keyList,
        map: this.clientMap,
      });

      ManagerLogger.info('[MANAGER] No Item Found.');

      return null;
    }

    ManagerLogger.debug('[MANAGER] Found Item: %o', {
      key,
      list: this.keyList,
      emailItem,
    });

    return emailItem;
  }

  public deleteItem(uuid: string): string | null {
    const foundIndex = this.findIndexKeyFromList(uuid);

    if (foundIndex === -1) {
      this.keyList.slice(foundIndex, 1);

      ManagerLogger.debug('[MANAGER] No Item Found: %o', {
        uuid,
        foundIndex,
        map: this.clientMap,
        keyList: this.keyList,
      });

      return null;
    }

    ManagerLogger.debug('[ACCOUNT] Item Deleted: %o', {
      key: uuid,
      foundIndex,
      map: this.clientMap,
      keyList: this.keyList,
    });
    // this.clientMap.delete({key: uuid});

    return uuid;
  }
}
