import { createCipheriv, createDecipheriv } from 'crypto';
import jwt from 'jsonwebtoken';

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

// AES 복호화
export const decryptString = (arg: string) => {
  const secretKey = process.env.SECRET_KEY!;
  const baseIv = process.env.AES_IV!;

  const iv = Buffer.from(baseIv);

  const encText = Buffer.from(arg, 'hex');

  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);

  const decrypted = decipher.update(encText);
  const decryptedString = Buffer.concat([decrypted, decipher.final()]).toString();

  return decryptedString;
};

describe('Crypt and Decrypt Test', () => {
  const targetString = '김동현';

  const encodedString = encryptString(targetString);

  const decodedString = decryptString(encodedString);

  test('Compare', () => {
    expect(decodedString).toBe(targetString);
  });
});

describe('JWT data', () => {
  interface JwtModel {
    user_id: string;
    user_email: string;
    user_status: number;
    is_manager: number;
  }

  const jwtData: JwtModel = {
    user_id: '1',
    user_email: 'ehdgus1524@gmail.com',
    user_status: 1,
    is_manager: 1,
  };

  const jwtKey = process.env.JWT_KEY!;

  const token = jwt.sign(jwtData, jwtKey, { expiresIn: 3 * 60 * 1000 });

  const decodedToken = <JwtModel>jwt.verify(token, jwtKey);

  test('JWT Verifying Test', () => {
    expect(decodedToken.user_email).toBe(jwtData.user_email);
  });
});
