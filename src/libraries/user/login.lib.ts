import { MariadbClass } from '@libraries/database/mariadb.lib';
import { getUserLoginInfoQuery } from '@queries/users/user.sql';
import { comparePasswords } from '@utilities/crypto.util';
import { UserLoginInfo } from 'types/user.type';

export const userLogin = async (email: string, password: string) => {
  try {
    const connection = MariadbClass.getInstance();
    const userInfo = await connection.query<UserLoginInfo>(getUserLoginInfoQuery, [email]);

    const isValidPw = await comparePasswords(password, userInfo.password);

    if (!isValidPw) return isValidPw;
  } catch (error) {
    throw new Error('[LOGIN] User Login Error');
  }
};
