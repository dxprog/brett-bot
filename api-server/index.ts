import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import {
  server as WebSocketServer,
  request,
  connection
} from 'websocket';

import config from '../config';
import { Logger } from './logger';

const app = express();
app.use(express.json());
app.use(cors());
const httpServer = http.createServer(app);
const socketServer = new WebSocketServer({
  httpServer,
  autoAcceptConnections: false
});

let deviceConnection: connection | null;
let logger = new Logger(config.dbPath);

function sendMessage(message: any) {
  if (deviceConnection) {
    console.log('Sending message to device', message);
    logger.log(message.command, message);
    deviceConnection.sendUTF(JSON.stringify(message));
  }
}

app.post('/:command', (req: express.Request, res: express.Response) => {
  sendMessage({
    command: req.params.command,
    ...req.body
  });
  res.send('OK');
});

app.get('/status', (req: express.Request, res: express.Response) => {
  res.json({
    connected: !!deviceConnection
  });
});

app.get('/log', async (req: express.Request, res: express.Response) => {
  const since = req.query.since || Date.now() - (3600 * 12 * 1000);
  const logs = await logger.fetch(since);
  res.json(logs);
});

httpServer.listen(config.port, () => {
  console.log(`Server listening on ${config.port}`);
});

socketServer.on('request', (req: request) => {
  const connection: connection = req.accept(config.socketProtocol, req.origin);

  console.log(`Received incoming connection`);

  connection.on('close', (reason: any, description: any) => {
    console.log(`Connection closed: [${reason}] ${description}`);
    deviceConnection = null;
  });

  deviceConnection = connection;
});