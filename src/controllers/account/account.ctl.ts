import { Body, Controller, Post } from '@nestjs/common';
import { loginRequestValidator, logoutRequestValidator } from '@validators/account/client.validator';
import { createAccountValidator, createClienttValidator } from '@validators/account/create.validator';
import { setErrorResponse, setResponse } from 'dto/response.dto';
import { ClientProvider } from 'providers/account/account.pvd';
import { LoginClientRequest, LogoutClientRequest } from 'types/account/client.type';
import { CreateAccountRequest, CreateClientRequest } from 'types/account/create.type';

@Controller('client')
export class ClientController {
  constructor(private readonly account: ClientProvider) {}

  @Post('signup')
  async createClient(@Body() request: CreateClientRequest) {
    try {
      const { email, password } = await createClienttValidator(request);

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

  @Post('logout')
  async logoutContoller(@Body() request: LogoutClientRequest) {
    try {
      const { uuid } = await logoutRequestValidator(request);

      const message = this.account.logout(uuid);

      return setResponse(200, { message });
    } catch (error) {
      return setErrorResponse(error);
    }
  }

  @Post('account/create')
  async createAccount(@Body() request: CreateAccountRequest) {
    try {
      const { uuid } = await createAccountValidator(request);

      const result = await this.account.createAccount(uuid);

      return setResponse(200, { result });
    } catch (error) {
      return setErrorResponse(error);
    }
  }
}
