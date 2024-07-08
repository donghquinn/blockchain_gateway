import { getAllNetwork } from '@libraries/web3/get.lib';
import { StartServer } from 'server';

const server = StartServer.getInstance();

await getAllNetwork();

server.serverStart();
