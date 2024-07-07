import { setErrorResponse } from '@dto/index';
import { DefaultContext } from 'koa';

export const signupController = async (ctx: DefaultContext) => {
  try {
  } catch (error) {
    return setErrorResponse(ctx, '99', new Error('[SIGNUP] Signup Failed'));
  }
};
