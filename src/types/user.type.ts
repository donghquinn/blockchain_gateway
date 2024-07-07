export interface UserLoginInfo {
  user_id: string;
  user_email: string;
  user_name: string;
  password: string;
  user_status: number;
  created: Date;
  updated: Date;
}

export interface UserInfo {
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

  // ----- ADDRESS
  address: string;
  nonce: bigint;
  balance: bigint;
  account_status: number;
  account_created: Date;
  account_updated: Date;
}
