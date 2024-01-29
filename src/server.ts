import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { shutdown } from '@utils/shutdown.utils';
import { AppModule } from '@modules/app.module';
import helmet from 'helmet';

export const bootstrap = async () => {
  const date = new Date().toLocaleTimeString();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['debug', 'log', 'error'],
  });

  const port = process.env.APP_PORT !== undefined ? process.env.APP_PORT : 5500;

  app.use(helmet());
  app.enableCors();
  app.enableVersioning();
  app.useBodyParser('json');
  app.enableShutdownHooks();

  await app.listen(port, () => {
    const message = `Gateway is Listening on ${port}`;
    const startTimeMessage = `Server has been started on ${date}`;
    const wrapper = '@'.repeat(message.length);

    Logger.log(wrapper);
    Logger.log(message);
    Logger.log(startTimeMessage);
    Logger.log(wrapper);

    process.send?.('ready');
  });

  process.on('SIGTERM', () => shutdown(app));
};
