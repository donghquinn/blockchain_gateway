export interface UserSignupRequest {
  email: string;
  name: string;
  password: string;
}

export interface UserLoginRequest {
  email: string;
  password: string;
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
  // ----- User
  user_email: string;
  user_name: string;

  // ----- Network
  network_name: string;
  rpc_url: string;

  // ----- Account
  address: string;
  nonce: bigint;
  balance: bigint;
  account_status: number;
  account_created: Date;
  account_updated: Date;
}
