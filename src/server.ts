import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "app.module";

export const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ["debug", "log", "error"],
  });

  const port = process.env.APP_PORT !== undefined ? process.env.APP_PORT : 5500;

  app.use();

  await app.listen(port, () => {
    const message = `Gateway is Listening on ${port}`;
    const wrapper = "@".repeat(message.length);

    Logger.log(wrapper);
    Logger.log(message);
    Logger.log(wrapper);
  });
};
