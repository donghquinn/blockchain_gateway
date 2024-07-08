import { web3CreateAccountController } from '@controllers/web3/account.ctl';
import { jwtValidateMiddleware } from '@middlewares/auth.middleware';
import { DefaultState } from 'koa';
import compose from 'koa-compose';
import Router from 'koa-router';
import { Web3AccountCreateRequest } from 'types/web3.type';

const web3AccountRouter = new Router<DefaultState, Web3AccountCreateRequest>();

const middlewares = compose([jwtValidateMiddleware]);

web3AccountRouter.post('/account/create', middlewares, (ctx) => web3CreateAccountController(ctx));

export { web3AccountRouter };
