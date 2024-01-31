import { Module } from '@nestjs/common';
import { AccountManager } from 'providers/account/account.manager';

@Module({
  providers: [AccountManager],
  exports: [AccountManager],
})
export class AccountManagerModule {}
