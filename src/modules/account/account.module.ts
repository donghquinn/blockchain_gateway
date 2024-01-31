import { AccountController } from '@controllers/account/account.ctl';
import { AccountPrismaModule } from '@modules/account.module';
import { ManagerModule } from '@modules/manager/manager.module';
import { Module } from '@nestjs/common';
import { AccountProvider } from '@providers/account/account.pvd';
import { Web3Module } from '../web3.module';

@Module({
  providers: [AccountProvider],
  controllers: [AccountController],
  imports: [AccountPrismaModule, Web3Module, ManagerModule],
})
export class AccountModule {}
