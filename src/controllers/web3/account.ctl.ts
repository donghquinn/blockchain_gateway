import { setErrorResponse } from '@dto/index';
import { setCreateAccountResponse } from '@dto/web3/web3.dto';
import { createAccount } from '@libraries/web3/account.lib';
import { createAccountValidator } from '@validators/web3/account.validator';
import { Web3AccountCreateRequest } from 'types/web3.type';

export const userCreateAccount = async (ctx: Web3AccountCreateRequest) => {
  try {
    const { userId, networkSeq } = await createAccountValidator(ctx);

    const { code, result } = await createAccount(userId, networkSeq);

    if (!result) return setErrorResponse(ctx, code, new Error('[WEB3] Create Account Error'));

    return setCreateAccountResponse(ctx, code, result);
  } catch (error) {
    return setErrorResponse(ctx, '99', new Error('[WEB3] Create Account Error'));
  }
};
