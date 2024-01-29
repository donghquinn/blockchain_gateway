import { createDecipheriv } from 'crypto';

export const decrypt = (encryptedString: string, token: string): string => {
  const secretKey = process.env.SECRET_KEY!;

  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(secretKey), Buffer.from(token, 'hex'));

  let decrypted = decipher.update(encryptedString, 'hex', 'utf-8');
  decrypted += decipher.final('utf-8');

  return decrypted;
};

export const comparePassword = (receivedPassword: string, encodedPassword: string, passwordToken: string): boolean => {
  const decryptedPassword = decrypt(encodedPassword, passwordToken);

  return receivedPassword !== decryptedPassword ? false : true;
};
