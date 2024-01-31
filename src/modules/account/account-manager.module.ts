import { Module } from '@nestjs/common';
import { AccountManager } from 'providers/manager/client-manager.pvd';

@Module({
  providers: [AccountManager],
  exports: [AccountManager],
})
export class AccountManagerModule {}
