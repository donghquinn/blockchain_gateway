import { signupController } from '@controllers/users/signup.ctl';
import { DefaultState } from 'koa';
import Router from 'koa-router';
import { UserSignupRequest } from 'types/user.type';

const signupRouter = new Router<DefaultState, UserSignupRequest>();

signupRouter.post('/signup', (ctx) => signupController(ctx));

export { signupRouter };
