import { ClientModule } from '@modules/account/account.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { globalMiddleware } from 'middlewares/global.middlewares';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [ClientModule, TransactionModule],
})
export class AppModule implements NestModule {
  // eslint-disable-next-line class-methods-use-this
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(globalMiddleware).forRoutes('*');
  }
}
