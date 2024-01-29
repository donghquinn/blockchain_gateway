import { Module } from "@nestjs/common";
import { TransactionProvider } from "providers/transaction/transaction.pvd";
import { TransactionPrismaModule } from "./transaction-prisma.module";
import { TransactionController } from "@controllers/transaction/transaction.ctl";

@Module({
  providers: [TransactionProvider],
  controllers: [TransactionController],
  imports: [TransactionPrismaModule],
})
export class TransactionModule {}
