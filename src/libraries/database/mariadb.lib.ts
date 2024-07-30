import { createTableTransaction } from '@assets/tables.sql';
import { MysqlError } from 'errors/mysql.error';
import { createPool, Pool, PoolOptions } from 'mysql2/promise';
import { QueryResultType } from 'types/databae.type';

export class MariadbClass {
  private static instance: MariadbClass;

  private connection: Pool;

  private connectionOption: PoolOptions;

  private user: string;

  private password: string;

  private host: string;

  private dbName: string;

  constructor() {
    this.user = process.env.MARIADB_USER!;

    this.password = process.env.MARIADB_PASSWORD!;

    this.host = process.env.MARIADB_HOST!;

    this.dbName = process.env.MARIADB_NAME!;

    this.connectionOption = {
      host: this.host,
      user: this.user,
      password: this.password,
      database: this.dbName,
    };

    this.connection = createPool(this.connectionOption);
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new MariadbClass();
    }

    return this.instance;
  }

  // 서버 시작 시, 테이블 생성 트랜잭션
  public async createTable(): Promise<void> {
    try {
      const conn = await this.connection.getConnection();
      await conn.beginTransaction();

      for (let i = 0; i <= createTableTransaction.length - 1; i += 1) {
        await conn.query(createTableTransaction[i]);
      }

      await conn.commit();

      conn.release();
    } catch (error) {
      throw new MysqlError(
        'CREATE TABLE',
        'Create Table Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  /**
   * 트랜잭션 쿼리 - SELECT
   * @param queryStringList 트랜잭션으로 밀어넣을 쿼리문
   * @returns
   */
  public async getMultiple(queryStringList: Array<Array<string>>): Promise<Array<any>> {
    try {
      const conn = await this.connection.getConnection();
      await conn.beginTransaction();

      const resultList = [];

      for (let i = 0; i <= queryStringList.length - 1; i += 1) {
        const queryString = queryStringList[i][0];
        const options = !queryStringList[i][1] ? '' : queryStringList[i][1];

        const [result] = await conn.query(queryString, options);

        resultList.push(result);
      }

      // const [result] = await this.pool.query<QueryResultType<T>>(sql, options)
      await conn.commit();
      conn.release();

      return resultList;
    } catch (error) {
      throw new MysqlError(
        'Get Multiple',
        'Get Multiple Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  public async query<T>(queryString: string, options?: unknown): Promise<QueryResultType<T>> {
    try {
      const [result] = await this.connection.query<QueryResultType<T>>(queryString, options);

      return result;
    } catch (error) {
      throw new MysqlError(
        'Query Single',
        'Query Single Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
