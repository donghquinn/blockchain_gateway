import { DefaultContext, DefaultState } from 'koa';
import Router from 'koa-router';
import { loginRouter } from './login.router';
import { signupRouter } from './signup.router';

const userRouter = new Router<DefaultState, any>('/users');

userRouter.use(loginRouter);
userRouter.use(signupRouter);

export { userRouter };
