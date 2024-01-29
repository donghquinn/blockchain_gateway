import { ClientController } from "@controllers/account/account.ctl";
import { Module } from "@nestjs/common";
import { ClientProvider } from "providers/account/account.pvd";
import { Web3Module } from "../web3.module";
import { AccountPrismaModule } from "./account-prisma.module";

@Module({
  providers: [ClientProvider],
  controllers: [ClientController],
  imports: [AccountPrismaModule, Web3Module],
})
export class ClientModule {}
