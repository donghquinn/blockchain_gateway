import { QueryResult } from 'mysql2';

export type QueryResultType<T> = QueryResult & T;
