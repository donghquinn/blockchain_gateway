import cors from '@koa/cors';
import { getAllNetwork } from '@libraries/web3/get.lib';
import { Logger } from '@utilities/logger.util';
import { Server } from 'http';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaHelmet from 'koa-helmet';
import { router } from './routers';

export class StartServer {
  private static instance: StartServer;

  private koa: Koa;

  public server: Server | null;

  private appPort: number;

  constructor() {
    this.appPort = Number(process.env.APP_PORT);

    this.koa = new Koa();

    this.server = null;
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new StartServer();
    }

    return this.instance;
  }

  private registerMiddleware() {
    this.koa.use(cors);
    this.koa.use(koaHelmet);
    this.koa.use(bodyParser);

    this.koa.use(router.routes);
    this.koa.use(router.allowedMethods);
  }

  private async settingUp() {
    await getAllNetwork();
  }

  public serverStart() {
    if (!this.server) {
      this.settingUp();

      this.registerMiddleware();

      this.server = this.koa.listen(this.appPort, () => {
        Logger.info(`[START] Server Start Listening: ${this.appPort}`);
      });

      return;
    }
  }
}
