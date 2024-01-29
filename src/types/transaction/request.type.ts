export interface SendTransactionRequest {
  from: string;
  to: string;
  value: bigint;
  gas: bigint;
}
