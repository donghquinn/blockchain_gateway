export interface LoginClientRequest {
  email: string;
  password: string;
}

export interface LogoutClientRequest {
  uuid: string;
}

export interface BalanceClientRequest {
  uuid: string;
  address: string;
}

export interface LoginedClientKey {
  key: string;
}

export interface LoginedClientItem {
  item: string;
}

export interface AccountListRequest {
  uuid: string;
}
