import { createCipheriv } from 'crypto';

export const encryptString = (arg: string) => {
  const secretKey = process.env.SECRET_KEY!;
  const baseIv = process.env.AES_IV!;
  const iv = Buffer.from(baseIv);

  const cipher = createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);

  const encrypted = cipher.update(arg);

  const encryptedString = Buffer.concat([encrypted, cipher.final()]).toString('hex');

  return encryptedString;
};
