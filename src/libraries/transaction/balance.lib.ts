export const subtractBalance = (balance: bigint, value: bigint) => balance - value;

export const compareBalance = (networkBalance: bigint, dbBalance: bigint) => networkBalance === dbBalance;

export const decideBalance = (networkBalance: bigint, dbBalance: bigint) => {
  const isSame = compareBalance(networkBalance, dbBalance);

  if (!isSame) return networkBalance;

  return dbBalance;
};
