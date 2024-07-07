export const encodeBase64 = (arg: string) => Buffer.from(arg).toString('base64');

export const decodeBase64 = (arg: string) => Buffer.from(arg, 'base64').toString();
