import { ValidatorError } from '@errors/validator.error';
import { Logger } from '@utils/logger.util';
import { BalanceClientRequest, LoginClientRequest, LogoutClientRequest } from 'types/account/client.type';
import { z } from 'zod';

export const loginRequestValidator = async (request: LoginClientRequest) => {
  try {
    const scheme = z.object({ email: z.string(), password: z.string() });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error('[LOGIN] Validate Login Account Error: %o', { error });

    throw new ValidatorError(
      '[ACCOUNT] Validate Login Account',
      'Validate Login Account Error. Please Try Again.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const logoutRequestValidator = async (request: LogoutClientRequest) => {
  try {
    const scheme = z.object({ uuid: z.string() });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error('[LOGOUT] Validate Logout Account Error: %o', { error });

    throw new ValidatorError(
      '[LOGOUT] Validate Logout Account',
      'Validate Logout Account Error. Please Try Again.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const balanceRequestValidator = async (request: BalanceClientRequest) => {
  try {
    const scheme = z.object({ uuid: z.string() });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error('[LOGIN] Validate Login Account Error: %o', { error });

    throw new ValidatorError(
      '[ACCOUNT] Validate Login Account',
      'Validate Login Account Error. Please Try Again.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
