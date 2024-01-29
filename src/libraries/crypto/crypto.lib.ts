import { randomBytes } from "crypto";

const createTokenBase = () => randomBytes(16).toString("base64");

export const cryptPassword = (password: string) => {
  const passwordToken = createTokenBase();

  const baseString = passwordToken + password;

  const encodedPassword = Buffer.from(baseString).toString("base64");

  return { encodedPassword, passwordToken };
};

export const cryptPrivateKey = (privateKey: string) => {
  const pkToken = createTokenBase();

  const baseString = pkToken + privateKey;

  const encodedPrivateKey = Buffer.from(baseString).toString("base64");

  return { encodedPrivateKey, pkToken };
};
