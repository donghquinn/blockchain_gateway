import { DefaultContext } from 'koa';
import { DefaultResponse } from 'types/response.type';
import { UserAccountInfo, UserGetAccountInfoRequest, UserLoginRequest } from 'types/user.type';

interface UserSignupResponse extends DefaultResponse {}

interface UserAccountResponse extends DefaultResponse {
  accountInfo: Array<UserAccountInfo>;
}

interface UserLoginResponse extends DefaultResponse {
  token: string;
}

export const SetSignupResponse = (ctx: DefaultContext, code: string) => {
  ctx.status = 200;

  const responseBody: UserSignupResponse = {
    result: true,
    code: code,
  };

  ctx.body = responseBody;
};

export const setLoginResponse = (ctx: UserLoginRequest, code: string, token: string) => {
  ctx.status = 200;

  const responseBody: UserLoginResponse = {
    result: true,
    code: code,
    token: token,
  };

  ctx.body = responseBody;
};

// 어카운트 정보 응답
export const setUserAccountResponse = (
  ctx: UserGetAccountInfoRequest,
  code: string,
  accountInfo: Array<UserAccountInfo>,
) => {
  ctx.status = 200;

  const responseBody: UserAccountResponse = {
    result: true,
    code: code,
    accountInfo: accountInfo,
  };

  ctx.body = responseBody;
};
