import { Module } from '@nestjs/common';
import { AccountPrismaLibrary } from 'providers/account/account-prisma.pvd';

@Module({
  providers: [AccountPrismaLibrary],
  exports: [AccountPrismaLibrary],
})
export class AccountPrismaModule {}
