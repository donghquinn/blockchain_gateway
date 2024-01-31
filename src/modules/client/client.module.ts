import { ClientController } from '@controllers/client/client.ctl';
import { AccountPrismaModule } from '@modules/account.module';
import { ManagerModule } from '@modules/manager/manager.module';
import { Module } from '@nestjs/common';
import { ClientProvider } from '@providers/client/client.pvd';

@Module({
  providers: [ClientProvider],
  imports: [AccountPrismaModule, ManagerModule],
  controllers: [ClientController],
})
export class ClientModule {}
