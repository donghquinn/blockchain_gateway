export interface SignedTransaction {
  messageHash: string;
  r: string;
  s: string;
  v: string;
  rawTransaction: string;
  transactionHash: string;
}
