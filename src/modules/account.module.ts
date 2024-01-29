import { AccountController } from "@controllers/account/account.ctl";
import { Module } from "@nestjs/common";
import { AccountProvider } from "providers/account/account.pvd";
import { PrismaModule } from "./prisma.module";
import { Web3Module } from "./web3.module";

@Module({
  providers: [AccountProvider],
  controllers: [AccountController],
  imports: [PrismaModule, Web3Module],
})
export class AccountModule {}
