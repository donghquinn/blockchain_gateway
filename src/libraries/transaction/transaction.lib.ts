import { Transaction } from 'web3';

export const createTransaction = (
  from: string,
  to: string,
  nonce: bigint,
  value: bigint,
  gas: bigint,
  gasPrice: bigint,
) => {
  const rawTransaction: Transaction = {
    from,
    to,
    value,
    gas,
    gasPrice,
    nonce,
  };

  return rawTransaction;
};
