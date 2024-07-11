import { Context, DefaultState } from 'koa';
import Router from 'koa-router';
import { web3AccountRouter } from './account.router';

const web3Router = new Router<DefaultState, Context>();

web3Router.use(web3AccountRouter);

export { web3Router };
