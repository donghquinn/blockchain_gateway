import { RedisClass } from '@libraries/database/redis.lib';
import { Web3Class } from '@libraries/shared/web3.lib';
import { DefaultReturn } from 'types';
import { NetworkQueryResult } from 'types/web3.type';

interface Web3CreateAccountReturn extends DefaultReturn {
  result: string | false;
}

export const createAccount = async (userId: string, networkSeq: number): Promise<Web3CreateAccountReturn> => {
  try {
    const redis = RedisClass.getInstance();

    const networkString = await redis.getAsync('WEB3_NETWORK');

    if (!networkString) return { code: '01', result: false };

    const networkList = <Array<NetworkQueryResult>>JSON.parse(networkString);

    const targetNetworkData = networkList.find((network) => network.network_seq === networkSeq);

    if (!targetNetworkData) return { code: '02', result: false };

    const web3 = Web3Class.getInstance(targetNetworkData.rpc_url);

    const address = await web3.createAccount(userId, networkSeq);

    return { code: '01', result: address };
  } catch (error) {
    throw new Error('[WEB3] Create Account Error');
  }
};
