import { Body, Controller, Post } from '@nestjs/common';
import { loginRequestValidator, logoutRequestValidator } from '@validators/account/client.validator';
import { createClienttValidator } from '@validators/account/create.validator';
import { setErrorResponse, setResponse } from 'dto/response.dto';
import { ClientProvider } from 'providers/client/client.pvd';
import { LoginClientRequest, LogoutClientRequest } from 'types/account/client.type';
import { CreateClientRequest } from 'types/account/create.type';

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

      const uuid = await this.account.login(email, password);

      return setResponse(200, { uuid });
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
}
