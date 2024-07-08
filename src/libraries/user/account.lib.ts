import { MariadbClass } from '@libraries/database/mariadb.lib';
import { getAccountInfoByUserIdQuery } from '@queries/users/user.sql';
import { QueryResultType } from 'types/databae.type';
import { UserAccountInfo } from 'types/user.type';

export const getAccountList = async (userId: string): Promise<QueryResultType<Array<UserAccountInfo>>> => {
  try {
    const mariadb = MariadbClass.getInstance();

    const accountList = await mariadb.query<Array<UserAccountInfo>>(getAccountInfoByUserIdQuery, [userId]);

    return accountList;
  } catch (error) {
    throw new Error('[USER] Get All Account List');
  }
};
