import { ClientController } from '@controllers/account/client.ctl';
import { Module } from '@nestjs/common';
import { ClientProvider } from 'providers/client/client.pvd';
import { Web3Module } from '../web3.module';
import { AccountPrismaModule } from './account-prisma.module';
import { AccountManagerModule } from './account-manager.module';

@Module({
  providers: [ClientProvider],
  controllers: [ClientController],
  imports: [AccountPrismaModule, Web3Module, AccountManagerModule],
})
export class ClientModule {}
