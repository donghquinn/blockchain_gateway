import { ManagerError } from '@errors/manager.error';
import { ManagerLogger } from '@utils/logger.util';
import { LoginedClientItem, LoginedClientKey } from 'types/account/client.type';

export class AccountManager {
  private static instance: AccountManager;

  private clientMap: WeakMap<LoginedClientKey, LoginedClientItem>;

  constructor() {
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

    const isLogined = this.searchKey(uuid);

    if (isLogined) {
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

      const isExsit = this.searchKey(uuid);

      if (!isExsit) {
        ManagerLogger.info('[CLIENT] It is not existing user. Clear Interval.');

        clearInterval(timer);
      }

      ManagerLogger.info('[CLIENT] Expiration time. Delete user.');

      this.deleteItem(uuid);
    }, interval);
  }

  public searchKey(clientUuid: string) {
    ManagerLogger.debug('[MANAGER] Client Map: %o', {
      map: this.clientMap,
    });

    return this.clientMap.has({ key: clientUuid });
  }

  public setItem(uuid: string, email: string) {
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

    const isExist = this.searchKey(uuid);

    if (!isExist) {
      ManagerLogger.info('[MANAGER] Search Logined Client Not Found Logined Client. Reject.');
      return;
    }

    this.clientMap.delete({ key: uuid });

    ManagerLogger.debug('[MANAGER] Delete Client Map Finsihed: %o', {
      map: this.clientMap,
    });
  }

  public findItem(clientUuid: string) {
    const item = this.clientMap.get({ key: clientUuid });

    ManagerLogger.debug('[MANAGER] Start to Search User Map: %o', {
      clientUuid,
      item,
      map: this.clientMap,
    });

    if (!item) {
      ManagerLogger.info('[MANAGER] Search Logined Client Not Found Logined Client. Reject.');

      throw new ManagerError('[FIND] Find Item', 'No Item Found. Reject');
    }

    ManagerLogger.debug('[MANAGER] Found Client Address: %o', {
      clientUuid,
      address: item.item,
    });

    return item;
  }
}
