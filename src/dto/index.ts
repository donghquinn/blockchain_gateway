import { DefaultContext } from 'koa';
import { DefaultResponse } from 'types/response.type';

interface ErrorResponse extends DefaultResponse {
  message: string;
}

export const setErrorResponse = (ctx: DefaultContext, code: string, error: Error) => {
  ctx.status = 500;

  const responseBody: ErrorResponse = {
    result: false,
    code: code,
    message: error.message,
  };

  ctx.body = responseBody;
};
