import { AccountError } from '@errors/client.error';
import { PrismaError } from '@errors/prisma.error';
import { TransactionError } from '@errors/transaction.error';
import { ValidatorError } from '@errors/validator.error';
import { Web3Error } from '@errors/web3.error';

interface KeyableObject {
  [key: string]: unknown;
}

export interface ResponseDto {
  resCode: number;
  dataRes: KeyableObject | null;
  errMsg: Array<unknown>;
}

export const setResponse = (resCode: number, data: KeyableObject) => {
  const responseData: ResponseDto = {
    resCode,
    dataRes: data,
    errMsg: [],
  };

  return responseData;
};

export const setErrorResponse = (errorMessage: unknown) => {
  let resCode: number;
  const errorMessageArray = [];

  if (errorMessage instanceof ValidatorError) {
    errorMessageArray.push(errorMessage.name, errorMessage.cause);
    resCode = 301;
  } else if (errorMessage instanceof PrismaError) {
    errorMessageArray.push(errorMessage.name, errorMessage.cause);
    resCode = 302;
  } else if (errorMessage instanceof Web3Error) {
    errorMessageArray.push(errorMessage.name, errorMessage.cause);
    resCode = 303;
  } else if (errorMessage instanceof AccountError) {
    errorMessageArray.push(errorMessage.name, errorMessage.cause);
    resCode = 304;
  } else if (errorMessage instanceof TransactionError) {
    errorMessageArray.push(errorMessage.name, errorMessage.cause);
    resCode = 305;
  } else {
    resCode = 500;
    errorMessageArray.push('Unknown Error Occured. Please Try Again.');
  }

  const responseData: ResponseDto = {
    resCode,
    dataRes: null,
    errMsg: errorMessageArray,
  };

  return responseData;
};
