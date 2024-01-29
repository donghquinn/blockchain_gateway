import { Body, Controller } from "@nestjs/common";
import { createAccountValidator } from "@validators/account/create.validator";
import { setErrorResponse, setResponse } from "dto/response.dto";
import { AccountProvider } from "providers/account/account.pvd";
import { CreateAccountRequest } from "types/account/create.type";

@Controller("account")
export class AccountController {
  constructor(private readonly account: AccountProvider) {}

  async createAccount(@Body() request: CreateAccountRequest) {
    try {
      const { email, password } = await createAccountValidator(request);

      const result = await this.account.createAccount(email, password);

      return setResponse(200, { result });
    } catch (error) {
      return setErrorResponse(error);
    }
  }
}
