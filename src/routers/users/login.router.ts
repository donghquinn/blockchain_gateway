import { userLoginController } from '@controllers/users/login.ctl';
import { DefaultState } from 'koa';
import Router from 'koa-router';
import { UserLoginRequest } from 'types/user.type';

const loginRouter = new Router<DefaultState, UserLoginRequest>();

loginRouter.post('/login', (ctx) => userLoginController(ctx));

export { loginRouter };
