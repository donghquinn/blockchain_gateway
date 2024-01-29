import { Module } from "@nestjs/common";
import { TransactionPrismaLibrary } from "providers/transaction/transaction-prisma.pvd";

@Module({
  providers: [TransactionPrismaLibrary],
  exports: [TransactionPrismaLibrary],
})
export class TransactionPrismaModule {}
