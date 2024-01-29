import { AccountModule } from "@modules/account.module";
import { Module } from "@nestjs/common";

@Module({
  imports: [AccountModule],
})
export class AppModule {}
