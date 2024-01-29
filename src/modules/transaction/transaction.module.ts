import { Module } from "@nestjs/common";
import { TransactionProvider } from "providers/transaction/transaction.pvd";
import { TransactionPrismaModule } from "./transaction-prisma.module";

@Module({
  providers: [TransactionProvider],
  imports: [TransactionPrismaModule],
})
export class TransactionModule {}
