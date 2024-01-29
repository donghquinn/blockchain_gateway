import { ValidatorError } from "@errors/validator.error";
import { Logger } from "@utils/logger.util";
import { CreateAccountRequest } from "types/account/create.type";
import { z } from "zod";

export const createAccountValidator = async (request: CreateAccountRequest) => {
  try {
    const scheme = z.object({ email: z.string(), password: z.string() });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error("[ACCOUNT] Validate Creating Account Error: %o", { error });

    throw new ValidatorError(
      "[ACCOUNT] Validate Creating Account",
      "Validate Creating Account Error. Please Try Again.",
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
