import { setErrorResponse } from '@dto/index';
import { SetSignupResponse } from '@dto/users/user.dto';
import { signupNewUser } from '@libraries/user/signup.lib';
import { signupValidator } from '@validators/users/signup.validator';
import { DefaultContext } from 'koa';
import { UserSignupRequest } from 'types/user.type';

export const signupController = async (ctx: UserSignupRequest) => {
  try {
    const { email, name, password } = await signupValidator(ctx);

    const signupResult = await signupNewUser(email, name, password);

    if (!signupResult) {
      return setErrorResponse(ctx, '01', new Error('[SIGNUP] Signup Failed'));
    }

    return SetSignupResponse(ctx, '01');
  } catch (error) {
    return setErrorResponse(ctx, '99', new Error('[SIGNUP] Signup Failed'));
  }
};
