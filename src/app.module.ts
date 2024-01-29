import { ClientModule } from "@modules/account.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [ClientModule],
})
export class AppModule {}
