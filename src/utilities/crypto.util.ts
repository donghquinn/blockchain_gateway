import { createCipheriv, createDecipheriv } from 'crypto';
import { decodeBase64 } from './encoding.util';
import { compare, hash } from 'bcrypt';

// AES 암호화
export const encryptString = (arg: string) => {
  const secretKey = process.env.SECRET_KEY!;
  const baseIv = process.env.AES_IV!;
  const iv = Buffer.from(baseIv);

  const cipher = createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);

  const encrypted = cipher.update(arg);

  const encryptedString = Buffer.concat([encrypted, cipher.final()]).toString('hex');

  return encryptedString;
};

// 패스워드 암호화
export const encryptPassword = async (password: string): Promise<string> => {
  try {
    const encryptedPassword = await hash(password, 10);

    return encryptedPassword;
  } catch (error) {
    throw new Error('[PASSWORD] Encrypt Password Error');
  }
};

// AES 복호화
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

// 패스워드 비교
export const comparePasswords = async (givenPw: string, dbPw: string): Promise<boolean> => {
  try {
    const decryptedGivenPw = decryptString(givenPw);
    const decodedDbPw = decodeBase64(dbPw);

    const isValidPw = await compare(decryptedGivenPw, decodedDbPw);

    return isValidPw;
  } catch (error) {
    throw new Error('[COMPARE] Compare Passwords Error');
  }
};
