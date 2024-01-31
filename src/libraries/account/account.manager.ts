import { ManagerLogger } from '@utils/logger.util';
import { LoginedClientItem, LoginedClientKey } from 'types/account/client.type';

export class AccountManager {
  private static instance: AccountManager;

  private keyList: Array<LoginedClientKey>;

  private clientMap: WeakMap<LoginedClientKey, LoginedClientItem>;

  constructor() {
    this.keyList = [];
    this.clientMap = new WeakMap();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new AccountManager();
    }

    return this.instance;
  }

  public setLoginUser(uuid: string, email: string) {
    ManagerLogger.debug('[CLIENT] Start Set Login: %o', {
      uuid,
      email,
      userMap: this.clientMap,
    });

    const userItem = this.findItem(uuid);

    if (userItem === null) {
      ManagerLogger.info('[CLIENT] Found Already Logined User Info. Ignore');

      return;
    }

    this.setItem(uuid, email);

    const interval = 1000 * 60 * 10;

    const timer = setInterval(() => {
      ManagerLogger.debug('[CLIENT] Start Managing Logined User.: %o', {
        uuid,
        email,
        userMap: this.clientMap,
      });

      const isExsit = this.findItem(uuid);

      if (isExsit === null) {
        ManagerLogger.info('[CLIENT] It is not existing user. Clear Interval.');

        clearInterval(timer);
      }

      ManagerLogger.info('[CLIENT] Expiration time. Delete user.');

      this.deleteItem(uuid);
    }, interval);
  }

  // public searchKey(clientUuid: string) {
  //   const isExist = this.clientMap.get({ key: clientUuid });

  //   ManagerLogger.debug('[MANAGER] Client Map: %o', {
  //     map: this.clientMap,
  //     isExist,
  //   });

  //   return isExist;
  // }

  public setItem(uuid: string, email: string) {
    this.keyList.push({ key: uuid });
    this.clientMap.set({ key: uuid }, { item: email });

    ManagerLogger.debug('[MANAGER] Set Client Map Finsihed: %o', {
      map: this.clientMap,
    });
  }

  public deleteItem(uuid: string) {
    ManagerLogger.debug('[MANAGER] Start Delete Client Map Finsihed: %o', {
      uuid,
      map: this.clientMap,
    });

    const isExist = this.findItem(uuid);

    if (isExist === null) {
      ManagerLogger.info('[MANAGER] Search Logined Client Not Found Logined Client. Reject.');
      return;
    }

    const index = this.keyList.findIndex((item) => item.key === uuid);

    if (index > -1) this.keyList.splice(index, 1);

    this.clientMap.delete({ key: uuid });

    ManagerLogger.debug('[MANAGER] Delete Client Map Finsihed: %o', {
      keyList: this.keyList,
      map: this.clientMap,
    });
  }

  public findItem(clientUuid: string): LoginedClientItem | null {
    const key = this.keyList.find((item) => item.key === clientUuid);

    if (!key) {
      ManagerLogger.debug('[MANAGER] Key is not found: %o', {
        keyList: this.keyList,
        clientUuid,
        key,
      });

      return null;
    }
    const item = this.clientMap.get(key);

    ManagerLogger.debug('[MANAGER] Start to Search User Map: %o', {
      clientUuid,
      item,
      keyList: this.keyList,
      map: this.clientMap,
    });

    if (item === undefined) {
      ManagerLogger.info('[MANAGER] Search Logined Client Not Found Logined Client. Reject.');

      return null;
    }

    ManagerLogger.debug('[MANAGER] Found Client Address: %o', {
      clientUuid,
      address: item.item,
    });

    return item;
  }
}
