import { MariadbClass } from '@libraries/database/mariadb.lib';
import { SetupError } from 'errors/setup.error';

// DB 테이블 세팅
export const setup = async () => {
  try {
    const mysql = MariadbClass.getInstance();

    await mysql.createTable();
  } catch (error) {
    throw new SetupError(
      '[SETTING_UP]',
      'Setup Database Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
