import { ValidatorError } from '@errors/validator.error';
import { Logger } from '@utils/logger.util';
import { SendTransactionRequest } from 'types/transaction/request.type';
import { z } from 'zod';

export const sendTransactionValidator = async (request: SendTransactionRequest) => {
  try {
    const scheme = z.object({
      from: z.string(),
      to: z.string(),
      value: z.bigint(),
      gas: z.bigint(),
    });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error('[TX] Send Transaction Error: %o', {
      error,
    });
    throw new ValidatorError(
      '[TX] Send Transaction',
      'Send Transaction Validating Error. Please Try Again.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
