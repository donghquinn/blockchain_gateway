import { MariadbClass } from '@libraries/database/mariadb.lib';
import { getUserLoginInfoQuery, insertUserInfoQuery } from '@queries/users/user.sql';
import { comparePasswords, decryptString, encryptPassword, encryptString } from '@utilities/crypto.util';
import { decodeBase64, encodeBase64 } from '@utilities/encoding.util';
import { randomUUID } from 'crypto';
import { UserLoginInfo } from 'types/user.type';

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

const decodeGivenUserInfo = (email: string, name: string, password: string) => {
  const decryptedEmail = decryptString(email);
  const decryptedName = decryptString(name);
  const decryptedPassword = decryptString(password);

  return { decryptedEmail, decryptedName, decryptedPassword };
};
