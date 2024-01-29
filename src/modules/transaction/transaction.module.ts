import { TransactionController } from '@controllers/transaction/transaction.ctl';
import { Web3Module } from '@modules/web3.module';
import { Module } from '@nestjs/common';
import { TransactionProvider } from 'providers/transaction/transaction.pvd';
import { TransactionPrismaModule } from './transaction-prisma.module';

@Module({
  providers: [TransactionProvider],
  controllers: [TransactionController],
  imports: [TransactionPrismaModule, Web3Module],
})
export class TransactionModule {}
