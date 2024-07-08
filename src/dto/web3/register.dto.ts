import { DefaultContext } from 'koa';
import { DefaultResponse } from 'types/response.type';
import { Web3NetworkRegisterRequest } from 'types/web3.type';

interface Web3RegisterResponse extends DefaultResponse {}

export const setNetworkRegisterResponse = (ctx: Web3NetworkRegisterRequest, code: string) => {
  ctx.status = 200;

  const responseBody: Web3RegisterResponse = {
    result: true,
    code: code,
  };

  ctx.body = responseBody;
};
