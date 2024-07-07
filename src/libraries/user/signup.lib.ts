import { MariadbClass } from '@libraries/database/mariadb.lib';
import { insertUserInfoQuery } from '@queries/users/user.sql';
import { decryptString, encryptPassword } from '@utilities/crypto.util';
import { encodeBase64 } from '@utilities/encoding.util';
import { randomUUID } from 'crypto';

// 회원가입
export const signupNewUser = async (email: string, name: string, password: string): Promise<boolean> => {
  try {
    const connection = MariadbClass.getInstance();

    const { decryptedEmail, decryptedName, decryptedPassword } = decodeGivenUserInfo(email, name, password);

    const encodedEmail = encodeBase64(decryptedEmail);
    const encodedName = encodeBase64(decryptedName);
    const encryptedPassword = await encryptPassword(decryptedPassword);

    const encodedPw = encodeBase64(encryptedPassword);

    const userId = randomUUID();

    const insertResult = await connection.query(insertUserInfoQuery, [userId, encodedEmail, encodedName, encodedPw]);

    if (!insertResult) return false;

    return true;
  } catch (error) {
    throw new Error('[SIGNUP] Signup New User Error');
  }
};

// 요청 바디의 유저 정보 디코딩
const decodeGivenUserInfo = (email: string, name: string, password: string) => {
  const decryptedEmail = decryptString(email);
  const decryptedName = decryptString(name);
  const decryptedPassword = decryptString(password);

  return { decryptedEmail, decryptedName, decryptedPassword };
};
