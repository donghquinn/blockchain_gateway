import { MariadbClass } from '@libraries/database/mariadb.lib';
import { RedisClass } from '@libraries/database/redis.lib';
import { getWeb3Network } from '@queries/web3/insert.sql';
import { QueryResultType } from 'types/databae.type';
import { NetworkQueryResult } from 'types/web3.type';

export const getAllNetwork = async (): Promise<QueryResultType<Array<NetworkQueryResult>>> => {
  try {
    const mariadb = MariadbClass.getInstance();

    const networkList = await mariadb.query<Array<NetworkQueryResult>>(getWeb3Network);

    const redis = RedisClass.getInstance();

    redis.setAsync('WEB3_NETWORK', JSON.stringify(networkList));

    return networkList;
  } catch (error) {
    throw new Error('[NETWORK] Get All Web3 Network Error');
  }
};
