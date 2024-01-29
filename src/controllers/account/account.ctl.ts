import { Body, Controller, Post } from '@nestjs/common';
import { loginRequestValidator } from '@validators/account/client.validator';
import { createAccountValidator } from '@validators/account/create.validator';
import { setErrorResponse, setResponse } from 'dto/response.dto';
import { ClientProvider } from 'providers/account/account.pvd';
import { LoginClientRequest } from 'types/account/client.type';
import { CreateAccountRequest } from 'types/account/create.type';

@Controller('client')
export class ClientController {
  constructor(private readonly account: ClientProvider) {}

  @Post('signup')
  async createClient(@Body() request: CreateAccountRequest) {
    try {
      const { email, password } = await createAccountValidator(request);

      const result = await this.account.createClient(email, password);

      return setResponse(200, { result });
    } catch (error) {
      return setErrorResponse(error);
    }
  }

  @Post('login')
  async loginContoller(@Body() request: LoginClientRequest) {
    try {
      const { email, password } = await loginRequestValidator(request);

      await this.account.login(email, password);
    } catch (error) {
      return setErrorResponse(error);
    }
  }

  @Post('account/create')
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
