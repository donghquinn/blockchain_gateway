import { MariadbClass } from '@libraries/database/mariadb.lib';
import { getUserLoginInfoQuery } from '@queries/users/user.sql';
import { createToken } from '@utilities/auth.util';
import { comparePasswords } from '@utilities/crypto.util';
import { UserLoginInfo } from 'types/user.type';

// 고객 로그인 요청
export const userLogin = async (email: string, password: string): Promise<string | boolean> => {
  try {
    const connection = MariadbClass.getInstance();

    const {
      user_id: userId,
      password: dbPassword,
      user_email: userEmail,
      user_status: userStatus,
      is_manager: isManager,
    } = await connection.query<UserLoginInfo>(getUserLoginInfoQuery, [email]);

    const isValidPw = await comparePasswords(password, dbPassword);

    if (!isValidPw) return false;

    const token = createToken(userId, userEmail, isManager, userStatus);

    return token;
  } catch (error) {
    throw new Error('[LOGIN] User Login Error');
  }
};
