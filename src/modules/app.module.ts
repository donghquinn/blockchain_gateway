import { AccountModule } from '@modules/account/account.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { globalMiddleware } from 'middlewares/global.middlewares';
import { TransactionModule } from './transaction/transaction.module';
import { ClientModule } from './client/client.module';

@Module({
  imports: [ClientModule, AccountModule, TransactionModule],
})
export class AppModule implements NestModule {
  // eslint-disable-next-line class-methods-use-this
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(globalMiddleware).forRoutes('*');
  }
}
