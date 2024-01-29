import { ClientController } from "@controllers/account/account.ctl";
import { Module } from "@nestjs/common";
import { ClientProvider } from "providers/account/account.pvd";
import { PrismaModule } from "./prisma.module";
import { Web3Module } from "./web3.module";

@Module({
  providers: [ClientProvider],
  controllers: [ClientController],
  imports: [PrismaModule, Web3Module],
})
export class ClientModule {}
