import { Module } from '@nestjs/common';
import { ClientManager } from 'providers/manager/client-manager.pvd';

@Module({
  providers: [ClientManager],
  exports: [ClientManager],
})
export class ManagerModule {}
