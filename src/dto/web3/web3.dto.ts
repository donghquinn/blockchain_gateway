import { DefaultContext } from 'koa';
import { DefaultResponse } from 'types/response.type';
import { UserAccountInfo } from 'types/user.type';

interface Web3AddressResponse extends DefaultResponse {
  address: string;
}

interface Web3BalanceRespponse extends DefaultResponse {
  balance: bigint;
}

interface Web3AccountResponse extends DefaultResponse {
  accountInfo: UserAccountInfo;
}

// 어카운트 잔고 응답
export const setBalanceResponse = (ctx: DefaultContext, code: string, balance: bigint) => {
  ctx.status = 200;

  const responseBody: Web3BalanceRespponse = {
    result: true,
    code: code,
    balance: balance,
  };

  ctx.body = responseBody;
};

// 어드레스 응답
export const setAddressResponse = (ctx: DefaultContext, code: string, address: string) => {
  ctx.status = 200;

  const responseBody: Web3AddressResponse = {
    result: true,
    code: code,
    address: address,
  };

  ctx.body = responseBody;
};

// 어카운트 정보 응답
export const setAccountResponse = (ctx: DefaultContext, code: string, accountInfo: UserAccountInfo) => {
  ctx.status = 200;

  const responseBody: Web3AccountResponse = {
    result: true,
    code: code,
    accountInfo: accountInfo,
  };

  ctx.body = responseBody;
};
