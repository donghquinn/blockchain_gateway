import { DefaultResponse } from 'types/response.type';
import { Web3AccountBalanceRequest, Web3AccountCreateRequest } from 'types/web3.type';

interface Web3BalanceRespponse extends DefaultResponse {
  balance: bigint;
}

interface Web3AccountCreateResponse extends DefaultResponse {
  address: string;
}

// 어카운트 잔고 응답
export const setBalanceResponse = (ctx: Web3AccountBalanceRequest, code: string, balance: bigint) => {
  ctx.status = 200;

  const responseBody: Web3BalanceRespponse = {
    result: true,
    code: code,
    balance: balance,
  };

  ctx.body = responseBody;
};

// 어드레스 응답
export const setCreateAccountResponse = (ctx: Web3AccountCreateRequest, code: string, address: string) => {
  ctx.status = 200;

  const responseBody: Web3AccountCreateResponse = {
    result: true,
    code: code,
    address: address,
  };

  ctx.body = responseBody;
};
