import { DefaultContext } from 'koa';
import { DefaultResponse } from 'types/response.type';

interface UserSignupResponse extends DefaultResponse {}

export const SetSignupResponse = (ctx: DefaultContext, code: string) => {
  ctx.status = 200;

  const responseBody: UserSignupResponse = {
    result: true,
    code: code,
  };

  ctx.body = responseBody;
};
