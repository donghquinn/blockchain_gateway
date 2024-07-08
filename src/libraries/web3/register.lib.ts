import { MariadbClass } from '@libraries/database/mariadb.lib';
import { insertWeb3Network } from '@queries/web3/insert.sql';

export const registerNetwork = async (networkName: string, rpcUrl: string): Promise<void> => {
  try {
    const mariadb = MariadbClass.getInstance();

    const insertResult = await mariadb.query(insertWeb3Network, [networkName, rpcUrl]);

    if (!insertResult) throw new Error('[NETWORK] Insert Network Error');
  } catch (error) {
    throw new Error('[NETWORK] Register Web3 Network Error');
  }
};

