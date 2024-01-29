import { createCipheriv, randomBytes } from "crypto";

export const cryptPassword = (password: string) => {
  const secretKey = process.env.SECRET_KEY!;
  const iv = randomBytes(16); // Initialization vector
  const cipher = createCipheriv("aes-256-cbc", Buffer.from(secretKey), iv);

  let encrypted = cipher.update(password, "utf-8", "hex");
  encrypted += cipher.final("hex");

  return { passwordToken: iv.toString("hex"), encodedPassword: encrypted };
};

export const cryptPrivateKey = (privateKey: string) => {
  const secretKey = process.env.SECRET_KEY!;
  const iv = randomBytes(16); // Initialization vector
  const cipher = createCipheriv("aes-256-cbc", Buffer.from(secretKey), iv);

  let encrypted = cipher.update(privateKey, "utf-8", "hex");
  encrypted += cipher.final("hex");

  return { pkToken: iv.toString("hex"), encodedPrivateKey: encrypted };
};
