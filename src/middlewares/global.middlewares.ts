import { HttpException, HttpStatus } from '@nestjs/common';
import { Logger } from '@utils/logger.util';
import { NextFunction, Request } from 'express';

export const globalMiddleware = (request: Request, response: Response, next: NextFunction) => {
  const authKey = request.headers?.key;
  const serverAuthKey = process.env.AUTH_KEY;

  Logger.debug('Request Info Received: %o', {
    authKey,
  });

  if (authKey !== serverAuthKey) throw new HttpException('Authorize Key is not Valid', HttpStatus.BAD_REQUEST);

  Logger.info('Authorize Success');

  next();
};
