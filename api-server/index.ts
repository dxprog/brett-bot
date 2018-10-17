import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import {
  server as WebSocketServer,
  request,
  connection
} from 'websocket';

import config from '../config';

const app = express();
app.use(express.json());
app.use(cors());
const httpServer = http.createServer(app);
const socketServer = new WebSocketServer({
  httpServer,
  autoAcceptConnections: false
});

let deviceConnection: connection | null;

function sendMessage(message: any) {
  if (deviceConnection) {
    console.log('Sending message to device', message);
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