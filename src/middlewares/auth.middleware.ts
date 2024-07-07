import { setErrorResponse } from '@dto/index';
import { validateToken } from '@utilities/auth.util';
import { DefaultContext, Next } from 'koa';

export const jwtValidateMiddleware = (ctx: DefaultContext, next: Next) => {
  try {
    const authHeader = ctx.headers.authorization;

    if (!authHeader) return setErrorResponse(ctx, '99', new Error('[JWT] Validate Token Error'));

    const token = authHeader.split('Bearer ')[1];

    const tokenValues = validateToken(token);

    ctx.user_id = tokenValues.user_id;
    ctx.user_email = tokenValues.user_email;
    ctx.user_status = tokenValues.user_status;
    ctx.is_manager = tokenValues.is_manager;

    return next();
  } catch (error) {
    return setErrorResponse(ctx, '99', new Error('[JWT] Validate Token Error'));
  }
};
