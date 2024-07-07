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

  public async query<T>(queryString: string, options?: unknown): Promise<QueryResultType<T>> {
    try {
      const [result] = await this.connection.query<QueryResultType<T>>(queryString, options);

      return result;
    } catch (error) {
      throw new Error('Query Error');
    }
  }
}
