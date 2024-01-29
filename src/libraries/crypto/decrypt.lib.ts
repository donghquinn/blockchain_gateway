import { createHash } from "crypto";
import { cryptPassword } from "./crypto.lib";
import { ClientError } from "@errors/client.error";

const cryptReceivedPassword = (
  receivedPassword: string,
  passwordToken: string,
) => {
  const hashBase = createHash("sha256");
  const base = receivedPassword + passwordToken;

  const encodedReceivedPassword = hashBase.update(base, "utf-8").digest("hex");

  return encodedReceivedPassword;
};

export const comparePassword = (
  receivedPassword: string,
  encodedPassword: string,
  passwordToken: string,
): boolean => {
  const encryptedReceivedPassword = cryptReceivedPassword(
    receivedPassword,
    passwordToken,
  );

  return encodedPassword !== encryptedReceivedPassword ? false : true;
};
