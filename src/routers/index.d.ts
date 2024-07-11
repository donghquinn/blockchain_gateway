import { Context, DefaultContext, DefaultState } from 'koa';
import Router from 'koa-router';
import { DefaultCtx } from 'types/response.type';
import { userRouter } from './users';
import { web3Router } from './web3';

const router = new Router<DefaultState, Context>();

router.use(userRouter);
router.use(web3Router);

export { router };
