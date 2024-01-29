import { ClientModule } from '@modules/account/account.module';
import { Module } from '@nestjs/common';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [ClientModule, TransactionModule],
})
export class AppModule {}
