import { createHash, randomBytes } from "crypto";

const createTokenBase = () => randomBytes(16).toString("base64");

export const cryptPassword = (password: string) => {
  const passwordToken = createTokenBase();

  const hashBase = createHash("sha256");

  const rawKey = passwordToken + password;

  const encodedPassword = hashBase.update(rawKey, "utf-8").digest("hex");

  return { encodedPassword, passwordToken };
};

export const cryptPrivateKey = (privateKey: string) => {
  const pkToken = createTokenBase();

  const hashBase = createHash("sha256");
  const rawKey = pkToken + privateKey;

  const encodedPrivateKey = hashBase.update(rawKey, "utf-8").digest("hex");

  return { encodedPrivateKey, pkToken };
};
