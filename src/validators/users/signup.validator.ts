import { UserSignupRequest } from 'types/user.type';
import { z } from 'zod';

export const signupValidator = async (ctx: UserSignupRequest) => {
  try {
    const scheme = z.object({ email: z.string(), name: z.string(), password: z.string() });

    const validated = await scheme.parseAsync(ctx);

    return validated;
  } catch (error) {
    throw new Error('[VALIDATION] Signup Request Error');
  }
};
