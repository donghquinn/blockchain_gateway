import { UserLoginRequest } from 'types/user.type';
import { z } from 'zod';

export const loginValidator = async (ctx: UserLoginRequest) => {
  try {
    const scheme = z.object({ email: z.string(), password: z.string() });

    const validated = await scheme.parseAsync(ctx);

    return validated;
  } catch (error) {
    throw new Error('[VALIDATION] Login Request Error');
  }
};
