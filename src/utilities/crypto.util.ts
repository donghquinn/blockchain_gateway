import { createCipheriv, createDecipheriv } from 'crypto';

export const encryptString = (arg: string) => {
  const secretKey = process.env.SECRET_KEY!;
  const baseIv = process.env.AES_IV!;
  const iv = Buffer.from(baseIv);

  const cipher = createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);

  const encrypted = cipher.update(arg);

  const encryptedString = Buffer.concat([encrypted, cipher.final()]).toString('hex');

  return encryptedString;
};

export const decryptString = (arg: string) => {
  const secretKey = process.env.SECRET_KEY!;
  const baseIv = process.env.AES_IV!;
  const iv = Buffer.from(baseIv, 'hex');

  const encText = Buffer.from(arg, 'hex');

  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);

  const decrypted = decipher.update(encText);
  const decryptedString = Buffer.concat([decrypted, decipher.final()]).toString();

  return decryptedString;
};
