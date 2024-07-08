import { Web3AccountCreateRequest } from 'types/web3.type';
import { z } from 'zod';

export const createAccountValidator = async (ctx: Web3AccountCreateRequest) => {
  try {
    const scheme = z.object({ userId: z.string(), networkSeq: z.number() });

    const validated = await scheme.parseAsync(ctx);

    return validated;
  } catch (error) {
    throw new Error('[VALIDATOR] Create Account Validation Error');
  }
};
