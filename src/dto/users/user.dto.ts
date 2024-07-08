import { DefaultContext } from 'koa';
import { DefaultResponse } from 'types/response.type';
import { UserAccountInfo, UserGetAccountInfoRequest } from 'types/user.type';

interface UserSignupResponse extends DefaultResponse {}

interface UserAccountResponse extends DefaultResponse {
  accountInfo: UserAccountInfo;
}

export const SetSignupResponse = (ctx: DefaultContext, code: string) => {
  ctx.status = 200;

  const responseBody: UserSignupResponse = {
    result: true,
    code: code,
  };

  ctx.body = responseBody;
};

// 어카운트 정보 응답
export const setUserAccountResponse = (ctx: UserGetAccountInfoRequest, code: string, accountInfo: UserAccountInfo) => {
  ctx.status = 200;

  const responseBody: UserAccountResponse = {
    result: true,
    code: code,
    accountInfo: accountInfo,
  };

  ctx.body = responseBody;
};
