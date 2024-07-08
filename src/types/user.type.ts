import { Context } from 'koa';

export interface UserSignupRequest extends Context {
  email: string;
  name: string;
  password: string;
}

export interface UserLoginRequest extends Context {
  email: string;
  password: string;
}

export interface UserGetAccountInfoRequest extends Context {
  userId: string;
}

// =======================

export interface UserLoginInfo {
  user_id: string;
  user_email: string;
  user_name: string;
  password: string;
  is_manager: number;
  user_status: number;
  created: Date;
  updated: Date;
}

export interface UserInfoQueryResult {
  // ----- USER
  user_id: string;
  user_email: string;
  user_name: string;
  password: string;
  user_status: number;
  created: Date;
  updated: Date;

  // ---- NETWORK
  network_name: string;
  network_status: number;

  // ----- account
  account_seq: number;
  address: string;
  privatekey: string;
  nonce: bigint;
  balance: bigint;
  account_status: number;
  account_created: Date;
  account_updated: Date;
}

// 응답할 때 담을 어카운트 정보
export interface UserAccountInfo {
  // ----- Network
  network_name: string;
  rpc_url: string;

  // ----- Account
  address_seq: number;
  network_seq: number;
  address: string;
  nonce: bigint;
  balance: bigint;
  account_created: Date;
  account_updated: Date;
}
