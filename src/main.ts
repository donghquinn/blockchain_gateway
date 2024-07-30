import { MariadbClass } from '@libraries/database/mariadb.lib';
import { StartServer } from 'server';

const mysql = MariadbClass.getInstance();

mysql.createTable();

const server = StartServer.getInstance();

server.serverStart();
