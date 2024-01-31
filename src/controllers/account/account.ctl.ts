import { Body, Controller, Post } from '@nestjs/common';
import { accountListRequestValidator, balanceRequestValidator } from '@validators/account/client.validator';
import { createAccountValidator } from '@validators/account/create.validator';
import { setErrorResponse, setResponse } from 'dto/response.dto';
import { AccountProvider } from 'providers/account/account.pvd';
import { AccountListRequest, BalanceClientRequest } from 'types/account/client.type';
import { CreateAccountRequest } from 'types/account/create.type';

@Controller('account')
export class AccountController {
  constructor(private readonly account: AccountProvider) {}

  @Post('create')
  async createAccount(@Body() request: CreateAccountRequest) {
    try {
      const { uuid } = await createAccountValidator(request);

      const result = await this.account.createAccount(uuid);

      return setResponse(200, { result });
    } catch (error) {
      return setErrorResponse(error);
    }
  }

  @Post('list')
  async accountListController(@Body() request: AccountListRequest) {
    try {
      const { uuid } = await accountListRequestValidator(request);

      const result = await this.account.getAccountList(uuid);

      return setResponse(200, { result });
    } catch (error) {
      return setErrorResponse(error);
    }
  }

  @Post('balance')
  async balanceController(@Body() request: BalanceClientRequest) {
    try {
      const { uuid, address } = await balanceRequestValidator(request);

      const balance = await this.account.getClientBalance(uuid, address);

      return setResponse(200, { balance });
    } catch (error) {
      return setErrorResponse(error);
    }
  }
}
