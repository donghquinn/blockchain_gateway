import { RedisError } from 'errors/redis.error';
import {
  createClient,
  RedisClientOptions,
  RedisClientType,
  RedisDefaultModules,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from 'redis';

export class RedisClass {
  private static instance: RedisClass;

  private connection: RedisClientType<RedisDefaultModules & RedisModules, RedisFunctions, RedisScripts>;

  private options: RedisClientOptions<RedisModules, RedisFunctions, RedisScripts>;

  private port: number;

  private host: string;

  constructor() {
    this.port = Number(process.env.REDIS_PORT!);
    this.host = process.env.REDIS_HOST!;

    this.options = {
      url: `redis://default:0@${this.host}:${this.port}`,
      legacyMode: true,
    };

    this.connection = createClient(this.options);
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new RedisClass();
    }

    return this.instance;
  }

  // 초기화
  public async clear() {
    try {
      await this.connection.flushAll();
    } catch (error) {
      throw new RedisError(
        'Clear All Network Data',
        'Clear All Network Data Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  public async getAsync(key: string): Promise<string | null> {
    try {
      const result = await this.connection.get(key);

      return result;
    } catch (error) {
      throw new RedisError('GET', 'Get Async', error instanceof Error ? error : new Error(JSON.stringify(error)));
    }
  }

  public async setAsync(key: string, values: string): Promise<void> {
    try {
      await this.connection.set(key, values);
    } catch (error) {
      throw new RedisError('SET', 'Set Async', error instanceof Error ? error : new Error(JSON.stringify(error)));
    }
  }
}
