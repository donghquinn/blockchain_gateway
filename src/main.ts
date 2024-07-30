import { StartServer } from 'server';
import { setup } from 'setup';

await setup();

const server = StartServer.getInstance();

server.serverStart();
