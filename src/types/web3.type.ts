import { Context } from 'koa';

export interface NetworkQueryResult {
  network_seq: number;
  network_name: string;
  rpc_url: string;
}

export interface Web3NetworkRegisterRequest extends Context {
  networkName: string;
  rpcUrl: string;
}

export interface Web3AccountCreateRequest extends Context {
  userId: string;
  networkSeq: number;
}

export interface Web3AccountBalanceRequest extends Context {
  address: string;
}
