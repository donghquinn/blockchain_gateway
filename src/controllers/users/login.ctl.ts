import { setErrorResponse } from '@dto/index';
import { setLoginResponse } from '@dto/users/user.dto';
import { userLogin } from '@libraries/user/login.lib';
import { loginValidator } from '@validators/users/login.validator';
import { UserLoginRequest } from 'types/user.type';

export const userLoginController = async (ctx: UserLoginRequest) => {
  try {
    const { email, password } = await loginValidator(ctx);

    const token = await userLogin(email, password);

    if (!token) return setErrorResponse(ctx, '01', new Error('[LOGIN] User Login Failed'));

    return setLoginResponse(ctx, '01', token);
  } catch (error) {
    return setErrorResponse(ctx, '99', new Error('[LOGIN] User Login Error.'));
  }
};
