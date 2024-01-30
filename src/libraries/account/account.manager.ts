import { ClientError } from '@errors/client.error';
import { ClientLogger } from '@utils/logger.util';
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

  public searchKey(clientUuid: string) {
    ClientLogger.debug('[LOGIN] Client Map: %o', {
      map: this.clientMap,
    });

    return this.clientMap.has({ key: clientUuid });
  }

  public setItem(uuid: string, address: string) {
    const isExist = this.searchKey(uuid);

    if (isExist) throw new ClientError('[LOGIN] Search Already Logined', 'Found Already Logined Client. Reject.');

    this.clientMap.set({ key: uuid }, { item: address });

    ClientLogger.debug('[LOGIN] Set Finished Map: %o', {
      map: this.clientMap,
    });

    const intevalTime = 1000 * 60 * 10;

    const timer = setInterval(() => {
      const isExistItem = this.searchKey(uuid);

      if (!isExistItem) {
        ClientLogger.info("[MANAGER] It's already deleted item. Clear");

        clearInterval(timer);
      }

      ClientLogger.debug('[LOGIN] As User Signed in for 10 minutes, Proceed Delete Login Map');

        this.deleteItem( uuid );
        
        clearInterval( timer );
    }, intevalTime);
  }

  public deleteItem(uuid: string) {
    const isExist = this.searchKey(uuid);

    if (!isExist) throw new ClientError('[LOGIN] Search Logined Client', 'Not Found Logined Client. Reject.');

    this.clientMap.delete({ key: uuid });
  }

  public findItem(clientUuid: string) {
    const item = this.clientMap.get({ key: clientUuid });

    if (!item) throw new ClientError('[LOGIN] Search Logined Client', 'Not Found Logined Client. Reject.');

    ClientLogger.debug('[FIND] Found Client Address: %o', {
      clientUuid,
      address: item.item,
    });

    return item;
  }
}
