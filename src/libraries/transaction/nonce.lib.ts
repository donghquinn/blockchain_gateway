export const compareNonce = (networkNonce: bigint, dbNonce: bigint) => (networkNonce === dbNonce ? true : false);

export const decideNonce = (networkNonce: bigint, dbNonce: bigint) => {
  const isSame = compareNonce(networkNonce, dbNonce);

  // Higher priority on network nonce.
  const nonce = !isSame ? networkNonce : dbNonce;

  return nonce;
};
