import { Context } from 'koa';

export interface DefaultResponse {
  result: boolean;
  code: string;
}

export interface DefaultCtx extends Context {}
