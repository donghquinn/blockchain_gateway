import { Module } from '@nestjs/common';
import { AccountPrismaLibrary } from '@providers/common/account-prisma.pvd';

@Module({
  providers: [AccountPrismaLibrary],
  exports: [AccountPrismaLibrary],
})
export class AccountPrismaModule {}
